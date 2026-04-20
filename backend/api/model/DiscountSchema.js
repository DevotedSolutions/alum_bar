const mongoose = require("mongoose");

const DiscountSchema = mongoose.Schema({
  mru: {
    type: Number,
    require: true,
    default: 0,
  },
  may: {
    type: Number,
    require: true,
    default: 0,
  },
  reu: {
    type: Number,
    require: true,
    default: 0,
  },
  others: {
    type: Number,
    require: true,
    default: 0,
  },
});

const DiscountData = mongoose.model("discounts", DiscountSchema);
module.exports = DiscountData;
