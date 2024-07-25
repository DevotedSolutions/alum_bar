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
  type: {
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
    required: true,
  },
  length: {
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
  profiles: [profileSchema],
  accessories: [accessorySchema],
  createdAt: {
    type: Date,
    default: Date.now, // This sets the default value to the current date and time
  },
});

const frappeJSModel = mongoose.model("frappeJS", frappeJSSchema);

module.exports = frappeJSModel;
