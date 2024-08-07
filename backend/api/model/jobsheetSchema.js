const mongoose = require("mongoose");

const jobSheetSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const jobSheetModel = mongoose.model("jobSheet", jobSheetSchema);

module.exports = jobSheetModel;
