const express = require("express");
const router = express.Router();
const authMiddleware = require("../middle/mddle");
const productController = require("../controller/productsController");
const upload = require("../middle/multrMidlewre");
const middlware = require("../middle/authMiddleware");
// products routes
// router.post('/addimg',MulterMiddlware.upload,productController.mydata);
router.post(
  "/addproducts",
  middlware.authMiddleware,
  upload.single("image"),
  productController.AddProduct
);
router.get(
  "/getoneproduct/:id",
  middlware.authMiddleware,
  productController.finOneProduct
);
router.get(
  "/getproducts",
  middlware.authMiddleware,
  productController.getAllproduct
);
router.put(
  "/updateproducts/:id",
  middlware.authMiddleware,
  upload.single("image"),
  productController.updateProduct
);
router.delete(
  "/deleteproducts/:id",
  middlware.authMiddleware,
  productController.deleteProduct
);
router.get(
  "/getqrcode/:id",
  middlware.authMiddleware,
  productController.getQrcode
);
router.get(
  "/decrement/:id/:quantity",
  middlware.authMiddleware,
  productController.DecrementQuantity
);
router.get(
  "/increment/:id",
  middlware.authMiddleware,
  productController.IncrementQuantity
);
router.post(
  "/updatequantity/:id",
  middlware.authMiddleware,
  productController.updateQuantity
);
router.get(
  "/getTotal",
  middlware.authMiddleware,
  productController.TotalProducts
);
router.get(
  "/lowstock",
  middlware.authMiddleware,
  productController.getLowStockProducts
);
router.get(
  "/mostproduct",
  middlware.authMiddleware,
  productController.getMostStockProducts
);
router.get(
  "/totalrevenue",
  middlware.authMiddleware,
  productController.getTotalRevenue
);
router.get(
  "/top-rated",
  middlware.authMiddleware,
  productController.getTopRatedProducts
);
router.get(
  "/top-sales",
  middlware.authMiddleware,
  productController.TopSalesProduct
);
router.get(
  "/top-sold",
  middlware.authMiddleware,
  productController.TopSoldProduct
);
router.get(
  "/last-week-sales",
  middlware.authMiddleware,
  productController.getLastWeekSales
);

module.exports = router;
