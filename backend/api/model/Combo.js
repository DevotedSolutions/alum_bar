const mongoose = require("mongoose");

const listSchema = mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const combosSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  list: {
    type: [listSchema],
    required: true,
  },
  image: {
    type: String,
  },
});

const combosModel = mongoose.model("combos", combosSchema);

module.exports = combosModel;
