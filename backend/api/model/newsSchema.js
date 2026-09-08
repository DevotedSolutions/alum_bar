const mongoose = require("mongoose");

// Items shown in the dashboard's "daily aluminium news" column. `impact` is
// the short operational takeaway rendered under the headline; `active` lets
// an item be retired without deleting it.
const NewsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  impact: {
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
