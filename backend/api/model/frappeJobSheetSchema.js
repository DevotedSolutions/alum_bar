const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  param: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  next: {
    type: String,
    required: false,
  },
});

const accessorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const glazzing = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});

const frappeJSSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobSheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobSheet",
    required: true,
  },
  client: {
    type: String,
  },
  projet: {
    type: String,
  },
  repere: {
    type: String,
  },
  handleDirection: {
    type: String,
    required: true,
  },
  handleHeight: {
    type: mongoose.Schema.Types.Mixed,
  },
  lang: {
    type: String,
    required: true,
  },
  jointCovers: {
    type: String,
    required: true,
  },
  threshold: {
    type: String,
    required: true,
  },
  closing: {
    type: String,
    required: true,
  },
  windowRef: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  glazzing: {
    type: String,
  },
  basement: {
    type: String,
  },
  blade: {
    type: Number,
  },
  thirdParty: {
    type: String,
  },
  thirdPartyValue: {
    type: Number,
  },
  profiles: [profileSchema],
  accessories: [accessorySchema],
  glazzingValues: [glazzing],
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const frappeJSModel = mongoose.model("frappeJS", frappeJSSchema);

module.exports = frappeJSModel;
