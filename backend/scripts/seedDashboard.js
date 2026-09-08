// Seeds the dashboard's price / news / exchange-rate collections with a
// starting set of readings so the panels have something to show before a
// real feed is wired up.
//
//   node scripts/seedDashboard.js            # only seeds empty collections
//   node scripts/seedDashboard.js --reset    # wipes and re-seeds them
//
// NOTE: this writes to whatever cluster "api/db config/db.js" points at.

const mongoose = require("mongoose");
const db = require("../api/db config/db");

const MetalPrice = require("../api/model/metalPriceSchema");
const News = require("../api/model/newsSchema");
const ExchangeRate = require("../api/model/exchangeRateSchema");
const DashboardSetting = require("../api/model/dashboardSettingSchema");

const reset = process.argv.includes("--reset");

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const ALU_TREND = [2.4, 2.44, 2.41, 2.46, 2.45, 2.49, 2.47, 2.52, 2.55, 2.53, 2.57, 2.58];

const FX_TRENDS = {
  USD: [46.4, 46.5, 46.45, 46.6, 46.7, 46.65, 46.76, 46.85],
  EUR: [55.2, 55.1, 55.15, 54.95, 55.0, 54.85, 54.85, 54.8],
  CNY: [6.48, 6.5, 6.49, 6.52, 6.51, 6.54, 6.54, 6.55],
};

const NEWS = [
  {
    title: "Global aluminium price edges higher on supply concerns",
    impact: "review supplier quotations today",
    source: "Metal Bulletin",
  },
  {
    title: "China production data supports regional premiums",
    impact: "monitor extrusion lead times",
    source: "Platts",
  },
  {
    title: "Freight rates remain stable on Indian Ocean routes",
    impact: "favourable shipping window continues",
    source: "Freight Insider",
  },
];

async function seedCollection(name, model, docs) {
  if (reset) {
    const { deletedCount } = await model.deleteMany({});
    console.log(`${name}: cleared ${deletedCount} existing document(s)`);
  } else {
    const existing = await model.countDocuments();
    if (existing > 0) {
      console.log(`${name}: ${existing} document(s) already present, skipping`);
      return;
    }
  }
  await model.insertMany(docs);
  console.log(`${name}: inserted ${docs.length} document(s)`);
}

async function run() {
  await db();

  const priceDocs = ALU_TREND.map((price, i) => ({
    metal: "aluminium",
    price,
    currency: "USD",
    unit: "kg",
    source: "LME",
    recordedAt: daysAgo(ALU_TREND.length - 1 - i),
  }));

  const rateDocs = [];
  Object.entries(FX_TRENDS).forEach(([base, trend]) => {
    trend.forEach((rate, i) => {
      rateDocs.push({
        base,
        quote: "MUR",
        rate,
        source: "MCB",
        recordedAt: daysAgo(trend.length - 1 - i),
      });
    });
  });

  const newsDocs = NEWS.map((n, i) => ({
    ...n,
    publishedAt: new Date(Date.now() - (i + 1) * 45 * 60 * 1000),
    active: true,
  }));

  await seedCollection("metalprices", MetalPrice, priceDocs);
  await seedCollection("exchangerates", ExchangeRate, rateDocs);
  await seedCollection("news", News, newsDocs);

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
