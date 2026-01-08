const mongoose = require("mongoose");
const { count } = require("./client");

const EventSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  start: {
    type: String,
    require: true,
  },
  end: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  otherType: {
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    type: Array || null,
  },
  address: {
    type: String || null,
  },
  country: {
    type: String,
  },
  note: {
    note: String,
  },
});

const Eventdata = mongoose.model("events", EventSchema);
module.exports = Eventdata;
