const express = require("express");
const router = express.Router();
const middlware = require("../middle/authMiddleware");
const dashboardController = require("../controller/dashboard-controller");

// Stock/reorder figures computed from the product collection.
router.get(
  "/dashboard/stock-summary",
  middlware.authMiddleware,
  dashboardController.getStockSummary
);

// The same reorder list as a styled spreadsheet, for ordering from.
router.get(
  "/dashboard/stock-summary.xlsx",
  middlware.authMiddleware,
  dashboardController.exportStockSummary
);

// Aluminium (or other metal) reference price.
router.get(
  "/dashboard/metal-price",
  middlware.authMiddleware,
  dashboardController.getMetalPrice
);
router.post(
  "/dashboard/metal-price",
  middlware.authMiddleware,
  dashboardController.addMetalPrice
);
// Pull the live metals board on demand; the GET above also tops up when stale.
router.post(
  "/dashboard/metal-price/refresh",
  middlware.authMiddleware,
  dashboardController.refreshMetalPrice
);

// Daily news column.
router.get(
  "/dashboard/news",
  middlware.authMiddleware,
  dashboardController.getNews
);
router.post(
  "/dashboard/news",
  middlware.authMiddleware,
  dashboardController.addNews
);
// Sweep Trading Economics on demand; the GET above also sweeps hourly.
router.post(
  "/dashboard/news/refresh",
  middlware.authMiddleware,
  dashboardController.refreshNews
);
router.delete(
  "/dashboard/news/:id",
  middlware.authMiddleware,
  dashboardController.deleteNews
);

// Currency pairs shown in the exchange-rate panel.
router.get(
  "/dashboard/exchange-rates",
  middlware.authMiddleware,
  dashboardController.getExchangeRates
);
router.post(
  "/dashboard/exchange-rates",
  middlware.authMiddleware,
  dashboardController.addExchangeRate
);
// Pull the live MCB board on demand; the GET above also tops up once a day.
router.post(
  "/dashboard/exchange-rates/refresh",
  middlware.authMiddleware,
  dashboardController.refreshExchangeRates
);

// Container capacity and other dashboard configuration.
router.get(
  "/dashboard/settings",
  middlware.authMiddleware,
  dashboardController.getSettings
);
router.post(
  "/dashboard/settings",
  middlware.authMiddleware,
  dashboardController.updateSetting
);

module.exports = router;
