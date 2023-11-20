const express=require("express");
const router=express.Router();
const authMiddleware=require("../middle/mddle")
const productController=require("../controller/productsController")
const upload=require('../middle/multrMidlewre');
// products routes
// router.post('/addimg',MulterMiddlware.upload,productController.mydata);
router.post('/addproducts',authMiddleware.authVerify,upload.single("image"),productController.AddProduct);
router.get('/getoneproduct/:id',productController.finOneProduct);
router.get('/getproducts',authMiddleware.authVerify,productController.getAllproduct);
router.put('/updateproducts/:id',authMiddleware.authVerify,upload.single("image"),productController.updateProduct);
router.delete('/deleteproducts/:id',authMiddleware.authVerify,productController.deleteProduct);
router.get('/getqrcode/:id',productController.getQrcode);
router.get('/decrement/:id',productController.DecrementQuantity);
router.get('/increment/:id',productController.IncrementQuantity);
router.post('/updatequantity/:id',productController.updateQuantity);



module.exports = router;