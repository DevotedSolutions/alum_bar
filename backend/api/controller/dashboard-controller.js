const ExcelJS = require("exceljs");

const productSchema = require("../model/productSchema");
const MetalPrice = require("../model/metalPriceSchema");
const News = require("../model/newsSchema");
const ExchangeRate = require("../model/exchangeRateSchema");
const DashboardSetting = require("../model/dashboardSettingSchema");
const { fetchMcbRates } = require("../services/mcbForex");
const { fetchMetalPricePerKg } = require("../services/metalsPrice");
const { fetchAluminiumNews } = require("../services/tradingEconomicsNews");

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

/** UTC midnight for a date - the key under which one day's reading is stored. */
const utcDayStart = (d = new Date()) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

/** Read a raw (non-numeric) dashboard setting value. */
async function getRawSetting(key) {
  const doc = await DashboardSetting.findOne({ key });
  return doc ? doc.value : undefined;
}

/** Write a raw dashboard setting value. */
async function setRawSetting(key, value) {
  await DashboardSetting.findOneAndUpdate(
    { key },
    { key, value, updatedAt: Date.now() },
    { upsert: true }
  );
}

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
async function buildStockSummary(limit) {
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

  return {
    totalOrderWeightKg,
    containerCapacityKg,
    containerPct,
    containerFreeKg: Math.max(0, containerCapacityKg - totalOrderWeightKg),
    weightByBand,
    counts: { ...counts, total: reorder.length },
    // Critical/low rows drive the reorder table; buffer top-ups only count
    // towards the weight totals above.
    reorder: reorder.filter((r) => r.band !== "buffer").slice(0, limit),
  };
}

exports.getStockSummary = async (req, res) => {
  try {
    const limit = Math.max(1, num(req.query.limit, 25));
    const summary = await buildStockSummary(limit);

    res.status(200).json({
      message: "Stock summary retrieved successfully",
      ...summary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve stock summary" });
  }
};

// How the dashboard's status chips read, reused by the export so the sheet
// matches the panel it was exported from.
const BAND_LABEL = { critical: "CRITICAL", low: "LOW", buffer: "BUFFER" };
const BAND_FILL = { critical: "FFFDECEE", low: "FFFFF3E2", buffer: "FFEEF8F8" };
const BAND_FONT = { critical: "FFD22D3A", low: "FFA76A00", buffer: "FF0D8B92" };

/**
 * The reorder panel as a .xlsx: the same rows and columns the dashboard
 * shows, with the container/weight figures above them so the sheet is
 * readable on its own once it has been mailed to a supplier.
 *
 * Exports the whole reorder list by default rather than the 25 rows the
 * panel displays - the point of the file is to order from it.
 */
exports.exportStockSummary = async (req, res) => {
  try {
    const limit = Math.max(1, num(req.query.limit, 1000));
    const summary = await buildStockSummary(limit);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "noutfermeture";
    workbook.created = new Date();
    const sheet = workbook.addWorksheet("Reorder & critical stock");

    sheet.columns = [
      { key: "status", width: 12 },
      { key: "product", width: 34 },
      { key: "code", width: 14 },
      { key: "current", width: 11 },
      { key: "healthy", width: 11 },
      { key: "orderQty", width: 12 },
      { key: "orderKg", width: 13 },
    ];

    const title = sheet.addRow(["Reorder & critical stock"]);
    title.font = { bold: true, size: 15, color: { argb: "FF22272E" } };
    sheet.mergeCells(title.number, 1, title.number, 7);

    const stamp = sheet.addRow([
      `Exported ${new Date().toLocaleString("en-GB")}`,
    ]);
    stamp.font = { size: 10, color: { argb: "FF6E757C" } };
    sheet.mergeCells(stamp.number, 1, stamp.number, 7);

    sheet.addRow([]);

    // Summary block, mirroring the cards above the panel.
    const facts = [
      ["Products below healthy stock", summary.counts.total],
      ["Critical", summary.counts.critical],
      ["Low stock", summary.counts.low],
      ["Total order weight (kg)", Math.round(summary.totalOrderWeightKg)],
      ["20ft container capacity (kg)", Math.round(summary.containerCapacityKg)],
      ["Container fill (%)", Math.round(summary.containerPct)],
      ["Container space left (kg)", Math.round(summary.containerFreeKg)],
    ];
    facts.forEach(([label, value]) => {
      const row = sheet.addRow([label, value]);
      row.getCell(1).font = { bold: true, color: { argb: "FF4A5158" } };
      row.getCell(2).numFmt = "#,##0";
      row.getCell(2).alignment = { horizontal: "left" };
    });

    sheet.addRow([]);

    const header = sheet.addRow([
      "STATUS",
      "PRODUCT",
      "CODE",
      "CURRENT",
      "HEALTHY",
      "ORDER QTY",
      "ORDER KG",
    ]);
    header.eachCell((cell) => {
      cell.font = { bold: true, size: 10, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF2B303A" },
      };
      cell.alignment = { vertical: "middle", horizontal: "left" };
    });
    header.height = 20;

    summary.reorder.forEach((r) => {
      const row = sheet.addRow([
        BAND_LABEL[r.band] || r.band,
        r.productName,
        r.productcode,
        r.current,
        r.healthy,
        r.orderQty,
        Math.round(r.orderKg),
      ]);

      const status = row.getCell(1);
      status.font = { bold: true, size: 10, color: { argb: BAND_FONT[r.band] } };
      status.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: BAND_FILL[r.band] },
      };
      status.alignment = { horizontal: "center" };

      // "Current" is the number that explains the status, so it carries the
      // band colour on the dashboard too.
      row.getCell(4).font = { bold: true, color: { argb: BAND_FONT[r.band] } };
      row.getCell(7).font = { bold: true };
      [4, 5, 6, 7].forEach((c) => {
        row.getCell(c).alignment = { horizontal: "right" };
        row.getCell(c).numFmt = "#,##0";
      });
      row.eachCell((cell) => {
        cell.border = { bottom: { style: "thin", color: { argb: "FFEDEFF2" } } };
      });
    });

    const totals = sheet.addRow([
      "",
      `${summary.reorder.length} product${summary.reorder.length === 1 ? "" : "s"} to order`,
      "",
      "",
      "",
      summary.reorder.reduce((sum, r) => sum + r.orderQty, 0),
      Math.round(summary.reorder.reduce((sum, r) => sum + r.orderKg, 0)),
    ]);
    totals.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF1F5F63" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF1F4F6" },
      };
    });
    [6, 7].forEach((c) => {
      totals.getCell(c).alignment = { horizontal: "right" };
      totals.getCell(c).numFmt = "#,##0";
    });

    // Keep the column titles in view when scrolling a long order list.
    sheet.views = [{ state: "frozen", ySplit: header.number }];
    sheet.autoFilter = {
      from: { row: header.number, column: 1 },
      to: { row: header.number, column: 7 },
    };

    const fileName = `reorder-critical-stock-${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to export stock summary" });
  }
};

// How long a stored price stays fresh before the board is polled again.
const METAL_PRICE_TTL_MS = 15 * 60 * 1000;

/**
 * Pull the live metals board and store today's reading. The document is keyed
 * on the UTC day, so intraday refreshes update today's point rather than
 * stacking extra points onto the sparkline.
 */
async function refreshMetalPrice(metal = "aluminium") {
  const quote = await fetchMetalPricePerKg(metal);
  const recordedAt = utcDayStart(quote.recordedAt);

  await MetalPrice.findOneAndUpdate(
    { metal: quote.metal, recordedAt },
    {
      metal: quote.metal,
      price: quote.pricePerKg,
      currency: quote.currency,
      unit: "kg",
      source: "LME",
      recordedAt,
      fetchedAt: new Date(),
    },
    { upsert: true }
  );

  return { metal: quote.metal, price: quote.pricePerKg, recordedAt };
}

/** True when today's reading is missing or older than the TTL. */
async function metalPriceIsStale(metal) {
  const newest = await MetalPrice.findOne({ metal })
    .sort({ recordedAt: -1 })
    .lean();
  if (!newest) return true;
  if (new Date(newest.recordedAt).getTime() < utcDayStart().getTime()) return true;

  const fetchedAt = newest.fetchedAt ? new Date(newest.fetchedAt).getTime() : 0;
  return Date.now() - fetchedAt > METAL_PRICE_TTL_MS;
}

/** Newest reference price for a metal, plus the readings behind it. */
exports.getMetalPrice = async (req, res) => {
  try {
    const metal = (req.query.metal || "aluminium").toLowerCase();
    const points = Math.max(2, num(req.query.points, 12));

    // Top up from the live board when what we hold has gone stale. A failure
    // is not fatal - fall through and serve the last reading we stored.
    if (req.query.refresh !== "false" && (await metalPriceIsStale(metal))) {
      try {
        await refreshMetalPrice(metal);
      } catch (error) {
        console.log("Metal price refresh failed, serving stored reading:", error.message);
      }
    }

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

/** Force a pull from the metals board now. */
exports.refreshMetalPrice = async (req, res) => {
  try {
    const result = await refreshMetalPrice(
      (req.body?.metal || req.query?.metal || "aluminium").toLowerCase()
    );
    res.status(200).json({
      message: `Refreshed ${result.metal} price from the live board`,
      ...result,
    });
  } catch (error) {
    console.log(error);
    res
      .status(502)
      .json({ message: `Failed to refresh metal price: ${error.message}` });
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

// Aluminium headlines are rare in the stream, so sweeping it more often than
// this mostly re-reads the same pages.
const NEWS_TTL_MS = 60 * 60 * 1000;
const NEWS_FETCHED_AT_KEY = "newsFetchedAt";

/**
 * Sweep Trading Economics for aluminium stories and store what it finds.
 * Stories are upserted on their upstream id, so a repeated sweep refreshes
 * the ones already held instead of duplicating them.
 */
async function refreshNews(options) {
  const stories = await fetchAluminiumNews(options);

  for (const story of stories) {
    const filter = story.externalId
      ? { externalId: story.externalId }
      : { title: story.title };

    await News.findOneAndUpdate(
      filter,
      {
        ...story,
        // Stories arriving from the feed are live unless retired by hand.
        $setOnInsert: { active: true },
      },
      { upsert: true }
    );
  }

  await setRawSetting(NEWS_FETCHED_AT_KEY, new Date().toISOString());
  return { count: stories.length };
}

/** True when the stream hasn't been swept inside the TTL. */
async function newsIsStale() {
  const last = await getRawSetting(NEWS_FETCHED_AT_KEY);
  if (!last) return true;
  const at = new Date(last).getTime();
  if (!Number.isFinite(at)) return true;
  return Date.now() - at > NEWS_TTL_MS;
}

/** Active news items, newest first. */
exports.getNews = async (req, res) => {
  try {
    const limit = Math.max(1, num(req.query.limit, 3));

    // Sweep the stream at most hourly; serve what is stored if it fails.
    if (req.query.refresh !== "false" && (await newsIsStale())) {
      try {
        await refreshNews();
      } catch (error) {
        console.log("News refresh failed, serving stored items:", error.message);
      }
    }

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

/** Force a sweep of the news stream now. */
exports.refreshNews = async (req, res) => {
  try {
    const { count } = await refreshNews({
      includeDescription: req.body?.includeDescription === true,
    });
    res.status(200).json({
      message: `Swept the stream and stored ${count} aluminium stor${count === 1 ? "y" : "ies"}`,
      count,
    });
  } catch (error) {
    console.log(error);
    res.status(502).json({ message: `Failed to refresh news: ${error.message}` });
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

/**
 * Pull the live MCB board and store one reading per pair for its rate date.
 * Re-running on the same day overwrites that day's readings rather than
 * stacking duplicates, so the sparkline stays one point per day.
 */
// How long a stored board stays fresh before MCB is polled again. They publish
// once a day, but the exact hour moves, so poll through the day to pick up a
// new board soon after it lands rather than waiting for the next midnight.
const EXCHANGE_RATE_TTL_MS = 3 * 60 * 60 * 1000;

async function refreshFromMcb() {
  const { asOf, rates } = await fetchMcbRates();
  const recordedAt = asOf || new Date();
  const fetchedAt = new Date();

  await Promise.all(
    rates.map((r) =>
      ExchangeRate.findOneAndUpdate(
        { base: r.base, quote: "MUR", recordedAt },
        {
          base: r.base,
          quote: "MUR",
          rate: r.mid,
          buy: r.buy,
          sell: r.sell,
          source: "MCB",
          recordedAt,
          fetchedAt,
        },
        { upsert: true }
      )
    )
  );

  return { recordedAt, fetchedAt, count: rates.length };
}

/**
 * True when MCB hasn't been polled inside the TTL. Measured from the poll, not
 * from the board's own date, so re-reading an unchanged board still counts as
 * having checked - otherwise every request between midnight and MCB publishing
 * would fire its own fetch.
 */
async function ratesAreStale() {
  const newest = await ExchangeRate.findOne().sort({ recordedAt: -1 }).lean();
  if (!newest) return true;

  const fetchedAt = newest.fetchedAt ? new Date(newest.fetchedAt).getTime() : 0;
  return Date.now() - fetchedAt > EXCHANGE_RATE_TTL_MS;
}

/** Latest rate per currency pair, with its recent trend and day-on-day move. */
exports.getExchangeRates = async (req, res) => {
  try {
    const points = Math.max(2, num(req.query.points, 8));

    // Top up from MCB on the first read after the TTL lapses.
    // A failure here is not fatal - fall through and serve what is stored.
    if (req.query.refresh !== "false" && (await ratesAreStale())) {
      try {
        await refreshFromMcb();
      } catch (error) {
        console.log("MCB forex refresh failed, serving stored rates:", error.message);
      }
    }

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
        buy: latest.buy === undefined ? null : num(latest.buy),
        sell: latest.sell === undefined ? null : num(latest.sell),
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

/** Force a pull from MCB now, rather than waiting for the daily top-up. */
exports.refreshExchangeRates = async (req, res) => {
  try {
    const { recordedAt, count } = await refreshFromMcb();
    res.status(200).json({
      message: `Refreshed ${count} rate(s) from MCB`,
      recordedAt,
      count,
    });
  } catch (error) {
    console.log(error);
    res
      .status(502)
      .json({ message: `Failed to refresh rates from MCB: ${error.message}` });
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
      buy: Number.isFinite(Number(req.body.buy)) ? Number(req.body.buy) : undefined,
      sell: Number.isFinite(Number(req.body.sell)) ? Number(req.body.sell) : undefined,
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
