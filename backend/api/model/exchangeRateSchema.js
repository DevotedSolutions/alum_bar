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
  rate: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    default: "MCB",
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

ExchangeRateSchema.index({ base: 1, quote: 1, recordedAt: -1 });

const ExchangeRate = mongoose.model("exchangerates", ExchangeRateSchema);
module.exports = ExchangeRate;
