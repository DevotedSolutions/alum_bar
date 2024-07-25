const mongoose = require("mongoose");

const jobSheetSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const jobSheetModel = mongoose.model("jobSheet", jobSheetSchema);

module.exports = jobSheetModel;
