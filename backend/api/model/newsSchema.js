const mongoose = require("mongoose");

// Items shown in the dashboard's "daily aluminium news" column. `impact` is
// the short operational takeaway rendered under the headline; `active` lets
// an item be retired without deleting it.
const NewsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  // Short operational takeaway, for hand-written items. Feed-sourced stories
  // carry `description` instead and the UI falls back to it.
  impact: {
    type: String,
  },
  description: {
    type: String,
  },
  // Upstream id, used to upsert a story rather than duplicate it on refresh.
  externalId: {
    type: String,
    index: true,
  },
  category: {
    type: String,
  },
  country: {
    type: String,
  },
  source: {
    type: String,
  },
  url: {
    type: String,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const News = mongoose.model("news", NewsSchema);
module.exports = News;
