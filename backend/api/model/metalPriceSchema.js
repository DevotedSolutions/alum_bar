const mongoose = require("mongoose");

// One reading of a raw-metal reference price. The dashboard's aluminium
// price card reads the newest document for a metal and builds its sparkline
// from the readings behind it, so insert one document per quote rather than
// updating a single row in place.
const MetalPriceSchema = mongoose.Schema({
  metal: {
    type: String,
    default: "aluminium",
    index: true,
  },
  // Always stored per kilogram; the UI converts to tonnes for display.
  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: "USD",
  },
  unit: {
    type: String,
    default: "kg",
  },
  source: {
    type: String,
    default: "LME",
  },
  recordedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

const MetalPrice = mongoose.model("metalprices", MetalPriceSchema);
module.exports = MetalPrice;
