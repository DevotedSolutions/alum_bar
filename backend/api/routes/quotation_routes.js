const express=require("express");
const quotationcontrl = require("../controller/quotation-product-controller");
const quotationupload = require("../middle/quotationMiddleware");
const router=express.Router();



router.get('/get-all-products' , quotationcontrl.getProducts)
router.get('/get-all-gamme',quotationcontrl.getGamme)
router.post('/add-designation',quotationupload.single("image"),quotationcontrl.addDesignation)
router.get('/get-designation',quotationcontrl.getDesignation)
router.put('/update-designation/:id',quotationupload.single("image"),quotationcontrl.updateDesignation);




module.exports = router;

