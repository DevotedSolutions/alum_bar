const express=require("express");
const router=express.Router();
const productController=require("../controller/productsController")
const upload=require('../middle/multrMidlewre');
// products routes
// router.post('/addimg',MulterMiddlware.upload,productController.mydata);
router.post('/addproducts',upload.single("image"),productController.AddProduct);
router.get('/getoneproduct/:id',productController.finOneProduct);
router.get('/getproducts',productController.getAllproduct);
router.put('/updateproducts/:id',upload.single("image"),productController.updateProduct);
router.delete('/deleteproducts/:id',productController.deleteProduct);
router.get('/getqrcode/:id',productController.getQrcode);
router.get('/decrement/:id',productController.DecrementQuantity);
router.get('/increment/:id',productController.IncrementQuantity);




module.exports = router;