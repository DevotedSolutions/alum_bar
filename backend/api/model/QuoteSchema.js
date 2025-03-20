const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  cermone: { type: String },
  verrou: { type: String },
  client: { type: String },
  color: { type: String, required: true },
  couvreJoint: { type: String, default: "" },
  designation: { type: String },
  fermeture: { type: String },
  hauteur: { type: Number, required: true },
  id: { type: mongoose.Schema.Types.ObjectId, required: true },
  image: { type: String },
  largeur: { type: Number, required: true },
  observations: { type: String, default: "" },
  ouverture: { type: String, default: "" },
  poignee: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  rep: { type: String },
  typeOuverture: { type: String, default: "" },
  clientEmail: { type: String, default: "" },
  clientPhone: { type: String, default: "" },
  comments: { type: String, default: "" },
  vitrage: { type: String },
  status: { type: String },
  createdBy: { type: String },
  user: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ModelName = mongoose.model("quote", schema);

module.exports = ModelName;
