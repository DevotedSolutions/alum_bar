const productSchema = require("../model/productSchema");
const MetalPrice = require("../model/metalPriceSchema");
const News = require("../model/newsSchema");
const ExchangeRate = require("../model/exchangeRateSchema");
const DashboardSetting = require("../model/dashboardSettingSchema");

// Payload a 20ft container is loaded to, used when no dashboard setting has
// been stored yet. Override by writing the `containerCapacityKg` setting.
const DEFAULT_CONTAINER_CAPACITY_KG = 24000;

// Fallback stock cutoffs for products that have no criticalMax/toOrderMax of
// their own. Mirrors STOCK_CUTOFFS in frontend/src/theme/tokens.js.
const DEFAULT_CRITICAL_MAX = 0;
const DEFAULT_TO_ORDER_MAX = 9;

const num = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** Read a dashboard setting, falling back when it has never been written. */
async function getSetting(key, fallback) {
  const doc = await DashboardSetting.findOne({ key });
  const value = doc ? Number(doc.value) : NaN;
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Classify a quantity as critical / low / buffer using the product's own
 * cutoffs. Kept in step with productStockBand() in the frontend's tokens.js.
 */
function stockBand(quantity, product) {
  const q = num(quantity);
  const criticalMax =
    product.criticalMax === undefined || product.criticalMax === null || product.criticalMax === ""
      ? DEFAULT_CRITICAL_MAX
      : num(product.criticalMax, DEFAULT_CRITICAL_MAX);
  const toOrderMax =
    product.toOrderMax === undefined || product.toOrderMax === null || product.toOrderMax === ""
      ? DEFAULT_TO_ORDER_MAX
      : num(product.toOrderMax, DEFAULT_TO_ORDER_MAX);

  if (q <= criticalMax) return "critical";
  if (q <= toOrderMax) return "low";
  return "buffer";
}

/**
 * Everything the dashboard's stock panels need: the products sitting below
 * their healthy level, the weight needed to restock them, and how that weight
 * fills a container. Computed here so the client doesn't have to pull the
 * whole product collection to work it out.
 */
exports.getStockSummary = async (req, res) => {
  try {
    const limit = Math.max(1, num(req.query.limit, 25));

    const products = await productSchema
      .find()
      .select("productName productcode quantity weight criticalMax toOrderMax healthyMin")
      .lean();

    const weightByBand = { critical: 0, low: 0, buffer: 0 };
    const counts = { critical: 0, low: 0, buffer: 0 };

    const reorder = [];
    products.forEach((p) => {
      const current = num(p.quantity);
      // Fall back to the "to order" ceiling when no healthy target is set,
      // otherwise the product would never appear on a restock list.
      const healthyRaw =
        p.healthyMin === undefined || p.healthyMin === null || p.healthyMin === ""
          ? p.toOrderMax
          : p.healthyMin;
      const healthy = num(healthyRaw);
      const orderQty = Math.max(0, healthy - current);
      if (orderQty <= 0) return;

      const band = stockBand(current, p);
      const orderKg = orderQty * num(p.weight);

      weightByBand[band] += orderKg;
      counts[band] += 1;

      reorder.push({
        _id: p._id,
        productName: p.productName,
        productcode: p.productcode,
        band,
        current,
        healthy,
        orderQty,
        orderKg,
      });
    });

    const bandRank = { critical: 0, low: 1, buffer: 2 };
    reorder.sort(
      (a, b) => bandRank[a.band] - bandRank[b.band] || b.orderKg - a.orderKg
    );

    const totalOrderWeightKg =
      weightByBand.critical + weightByBand.low + weightByBand.buffer;

    const containerCapacityKg = await getSetting(
      "containerCapacityKg",
      DEFAULT_CONTAINER_CAPACITY_KG
    );
    const containerPct = containerCapacityKg
      ? Math.min(100, (totalOrderWeightKg / containerCapacityKg) * 100)
      : 0;

    res.status(200).json({
      message: "Stock summary retrieved successfully",
      totalOrderWeightKg,
      containerCapacityKg,
      containerPct,
      containerFreeKg: Math.max(0, containerCapacityKg - totalOrderWeightKg),
      weightByBand,
      counts: { ...counts, total: reorder.length },
      // Critical/low rows drive the reorder table; buffer top-ups only count
      // towards the weight totals above.
      reorder: reorder.filter((r) => r.band !== "buffer").slice(0, limit),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve stock summary" });
  }
};

/** Newest reference price for a metal, plus the readings behind it. */
exports.getMetalPrice = async (req, res) => {
  try {
    const metal = (req.query.metal || "aluminium").toLowerCase();
    const points = Math.max(2, num(req.query.points, 12));

    const readings = await MetalPrice.find({ metal })
      .sort({ recordedAt: -1 })
      .limit(points)
      .lean();

    if (!readings.length) {
      return res
        .status(404)
        .json({ message: `No price readings stored for ${metal}` });
    }

    const latest = readings[0];
    const previous = readings[1];
    const changePct =
      previous && num(previous.price)
        ? ((num(latest.price) - num(previous.price)) / num(previous.price)) * 100
        : 0;

    res.status(200).json({
      message: "Metal price retrieved successfully",
      metal,
      price: num(latest.price),
      currency: latest.currency,
      unit: latest.unit,
      source: latest.source,
      recordedAt: latest.recordedAt,
      changePct,
      // Oldest -> newest so the client can plot it directly.
      trend: readings.map((r) => num(r.price)).reverse(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve metal price" });
  }
};

/** Record a new reference-price reading. */
exports.addMetalPrice = async (req, res) => {
  try {
    const { price } = req.body;
    if (price === undefined || price === null || !Number.isFinite(Number(price))) {
      return res.status(400).json({ message: "A numeric price is required" });
    }

    const reading = await MetalPrice.create({
      metal: (req.body.metal || "aluminium").toLowerCase(),
      price: Number(price),
      currency: req.body.currency || "USD",
      unit: req.body.unit || "kg",
      source: req.body.source || "LME",
      recordedAt: req.body.recordedAt || Date.now(),
    });

    res.status(200).json({ message: "Price reading added successfully", reading });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add price reading" });
  }
};

/** Active news items, newest first. */
exports.getNews = async (req, res) => {
  try {
    const limit = Math.max(1, num(req.query.limit, 3));

    const news = await News.find({ active: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({ message: "News retrieved successfully", news });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve news" });
  }
};

exports.addNews = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "A title is required" });
    }

    const item = await News.create({
      title,
      impact: req.body.impact,
      source: req.body.source,
      url: req.body.url,
      publishedAt: req.body.publishedAt || Date.now(),
      active: req.body.active === undefined ? true : !!req.body.active,
    });

    res.status(200).json({ message: "News item added successfully", item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add news item" });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const item = await News.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "News item not found" });
    }
    res.status(200).json({ message: "News item deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete news item" });
  }
};

/** Latest rate per currency pair, with its recent trend and day-on-day move. */
exports.getExchangeRates = async (req, res) => {
  try {
    const points = Math.max(2, num(req.query.points, 8));

    // Newest-first across every pair, then grouped client-side of Mongo so the
    // per-pair trend keeps its ordering without one query per pair.
    const readings = await ExchangeRate.find()
      .sort({ recordedAt: -1 })
      .limit(points * 25)
      .lean();

    const byPair = new Map();
    readings.forEach((r) => {
      const key = `${r.base}/${r.quote}`;
      if (!byPair.has(key)) byPair.set(key, []);
      const bucket = byPair.get(key);
      if (bucket.length < points) bucket.push(r);
    });

    const rates = [];
    byPair.forEach((bucket, key) => {
      const latest = bucket[0];
      const previous = bucket[1];
      const changePct =
        previous && num(previous.rate)
          ? ((num(latest.rate) - num(previous.rate)) / num(previous.rate)) * 100
          : 0;

      rates.push({
        pair: key,
        base: latest.base,
        quote: latest.quote,
        rate: num(latest.rate),
        source: latest.source,
        recordedAt: latest.recordedAt,
        changePct,
        trend: bucket.map((r) => num(r.rate)).reverse(),
      });
    });

    rates.sort((a, b) => a.pair.localeCompare(b.pair));

    res.status(200).json({
      message: "Exchange rates retrieved successfully",
      source: rates.length ? rates[0].source : null,
      asOf: rates.length ? rates[0].recordedAt : null,
      rates,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve exchange rates" });
  }
};

exports.addExchangeRate = async (req, res) => {
  try {
    const { base, rate } = req.body;
    if (!base || !Number.isFinite(Number(rate))) {
      return res
        .status(400)
        .json({ message: "A base currency and a numeric rate are required" });
    }

    const reading = await ExchangeRate.create({
      base: String(base).toUpperCase(),
      quote: String(req.body.quote || "MUR").toUpperCase(),
      rate: Number(rate),
      source: req.body.source || "MCB",
      recordedAt: req.body.recordedAt || Date.now(),
    });

    res.status(200).json({ message: "Rate reading added successfully", reading });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add rate reading" });
  }
};

exports.getSettings = async (req, res) => {
  try {
    const settings = await DashboardSetting.find().lean();
    const map = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    if (map.containerCapacityKg === undefined) {
      map.containerCapacityKg = DEFAULT_CONTAINER_CAPACITY_KG;
    }
    res.status(200).json({ message: "Settings retrieved successfully", settings: map });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve dashboard settings" });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ message: "A setting key is required" });
    }

    const setting = await DashboardSetting.findOneAndUpdate(
      { key },
      { key, value, label: req.body.label, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Setting saved successfully", setting });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to save dashboard setting" });
  }
};
