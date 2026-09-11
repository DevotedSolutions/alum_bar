const mongoose = require("mongoose");

// One reading of a currency pair. Like metal prices these are append-only:
// the dashboard takes the newest document per base/quote pair and draws its
// sparkline and day-on-day delta from the readings before it.
const ExchangeRateSchema = mongoose.Schema({
  base: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
    default: "MUR",
  },
  // Midpoint of the buy/sell spread - the single figure the dashboard quotes.
  rate: {
    type: Number,
    required: true,
  },
  buy: {
    type: Number,
  },
  sell: {
    type: Number,
  },
  source: {
    type: String,
    default: "MCB",
  },
  // The date MCB stamped on the board, normalised to UTC midnight.
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  // When we last polled MCB, which drives the staleness check. Distinct from
  // recordedAt: re-polling an unchanged board advances this but not that.
  fetchedAt: {
    type: Date,
    default: Date.now,
  },
});

// One board per day per pair: refreshing repeatedly on the same day updates
// the existing reading instead of stacking duplicates onto the sparkline.
ExchangeRateSchema.index({ base: 1, quote: 1, recordedAt: -1 });

const ExchangeRate = mongoose.model("exchangerates", ExchangeRateSchema);
module.exports = ExchangeRate;
