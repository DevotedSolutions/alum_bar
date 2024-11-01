const express = require("express");
const quotationcontrl = require("../controller/quotation-product-controller");
const quotationupload = require("../middle/quotationMiddleware");
const pdfUpload = require("../middle/quatationfileMiddleware");
const router = express.Router();
const middlware = require("../middle/authMiddleware");

router.get(
  "/get-all-products",
  middlware.authMiddleware,
  quotationcontrl.getProducts
);
router.get("/get-all-gamme", quotationcontrl.getGamme);
router.post(
  "/add-designation",
  quotationupload.single("image"),
  quotationcontrl.addDesignation
);
router.get("/get-designation", quotationcontrl.getDesignation);
router.put(
  "/update-designation/:id",
  quotationupload.single("image"),
  quotationcontrl.updateDesignation
);
router.delete(
  "/delete-designation/:id",
  middlware.authMiddleware,
  quotationcontrl.deleteDesignation
);
router.get("/price", quotationcontrl.checkPrice);
router.get("/min-max-dimensions/:id", quotationcontrl.getMinAndMaxDimensions);
router.post("/save-quotes", quotationcontrl.saveQuotes);
router.get(
  "/all-quotes",
  middlware.authMiddleware,
  quotationcontrl.getAllQuotesSorted
);
router.delete(
  "/delete-order/:id",
  middlware.authMiddleware,
  quotationcontrl.deleteOrder
);
router.post(
  "/add-quotation",
  pdfUpload.single("pdf"),
  quotationcontrl.saveQuotation
);
router.get(
  "/get-quotations",
  middlware.authMiddleware,
  quotationcontrl.getQuotations
);

module.exports = router;
