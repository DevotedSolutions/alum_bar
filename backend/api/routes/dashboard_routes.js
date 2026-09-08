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
