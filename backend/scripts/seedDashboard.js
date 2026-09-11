// Primes the dashboard's collections by pulling each live source once, so the
// panels have data before the app's own hourly/daily top-ups kick in.
//
//   node scripts/seedDashboard.js            # fetch and store
//   node scripts/seedDashboard.js --reset    # clear the collections first
//
// Every write is an upsert keyed the same way the app keys it, so re-running
// this is safe and will not duplicate readings.
//
// NOTE: this writes to whatever cluster "api/db config/db.js" points at.

const mongoose = require("mongoose");
const db = require("../api/db config/db");

const MetalPrice = require("../api/model/metalPriceSchema");
const News = require("../api/model/newsSchema");
const ExchangeRate = require("../api/model/exchangeRateSchema");
const DashboardSetting = require("../api/model/dashboardSettingSchema");
const { fetchMcbRates } = require("../api/services/mcbForex");
const { fetchMetalPricePerKg } = require("../api/services/metalsPrice");
const { fetchAluminiumNews } = require("../api/services/tradingEconomicsNews");

const reset = process.argv.includes("--reset");

/** --reset: drop what's stored so the next pull starts from a clean slate. */
async function clearCollections() {
  for (const [name, model] of [
    ["metalprices", MetalPrice],
    ["exchangerates", ExchangeRate],
    ["news", News],
  ]) {
    const { deletedCount } = await model.deleteMany({});
    console.log(`${name}: cleared ${deletedCount} existing document(s)`);
  }
}

/** Store today's aluminium price, keyed on the UTC day like the API does. */
async function seedMetalPrice() {
  const quote = await fetchMetalPricePerKg("aluminium");
  const d = quote.recordedAt;
  const recordedAt = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

  await MetalPrice.findOneAndUpdate(
    { metal: "aluminium", recordedAt },
    {
      metal: "aluminium",
      price: quote.pricePerKg,
      currency: quote.currency,
      unit: "kg",
      source: "LME",
      recordedAt,
      fetchedAt: new Date(),
    },
    { upsert: true }
  );

  return quote;
}

/** Store today's MCB board, one reading per pair. */
async function seedExchangeRates() {
  const { asOf, rates } = await fetchMcbRates();
  const recordedAt = asOf || new Date();
  const fetchedAt = new Date();

  for (const r of rates) {
    await ExchangeRate.findOneAndUpdate(
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
    );
  }

  return { recordedAt, count: rates.length };
}

/** Store whatever aluminium stories the stream is carrying. */
async function seedNews() {
  const stories = await fetchAluminiumNews();

  for (const story of stories) {
    const filter = story.externalId
      ? { externalId: story.externalId }
      : { title: story.title };
    await News.findOneAndUpdate(
      filter,
      { ...story, $setOnInsert: { active: true } },
      { upsert: true }
    );
  }

  return stories.length;
}

async function run() {
  await db();

  if (reset) await clearCollections();

  // Every panel is live now, so seeding means "go and fetch it once".
  // Each step is independent: one upstream being down shouldn't stop the rest.
  try {
    const quote = await seedMetalPrice();
    console.log(
      `metalprices: aluminium $${quote.pricePerKg.toFixed(4)}/kg ` +
        `($${quote.pricePerTonne}/tonne)`
    );
  } catch (error) {
    console.log(`metalprices: fetch failed (${error.message}) - skipped`);
  }

  try {
    const { recordedAt, count } = await seedExchangeRates();
    console.log(
      `exchangerates: stored ${count} MCB rate(s) for ${recordedAt
        .toISOString()
        .slice(0, 10)}`
    );
  } catch (error) {
    console.log(`exchangerates: MCB fetch failed (${error.message}) - skipped`);
  }

  try {
    const count = await seedNews();
    console.log(`news: stored ${count} aluminium stor${count === 1 ? "y" : "ies"}`);
  } catch (error) {
    console.log(`news: feed fetch failed (${error.message}) - skipped`);
  }

  await DashboardSetting.findOneAndUpdate(
    { key: "containerCapacityKg" },
    {
      key: "containerCapacityKg",
      value: 24000,
      label: "20ft container payload (kg)",
      updatedAt: Date.now(),
    },
    { upsert: true }
  );
  console.log("dashboardsettings: containerCapacityKg set to 24000");

  await mongoose.connection.close();
  console.log("Done.");
}

run().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch (e) {
    /* ignore */
  }
  process.exit(1);
});
