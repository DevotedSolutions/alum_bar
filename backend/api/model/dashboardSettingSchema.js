const mongoose = require("mongoose");

// Simple key/value store for dashboard figures that are configuration rather
// than measurements - currently the container payload the restock order is
// measured against. Read through getSetting() in dashboard-controller.js so a
// missing document falls back to a sensible default.
const DashboardSettingSchema = mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
  label: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const DashboardSetting = mongoose.model("dashboardsettings", DashboardSettingSchema);
module.exports = DashboardSetting;
