const productSchema = require("../model/productSchema");
const QRCode = require('qrcode');
const mongoose = require('mongoose'); // Import Mongoose

exports.AddProduct = async (req, res) => {
  const { productName, productDescription, quantity, productcode } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (!productName || !productDescription || !quantity || !productcode) {
      return res.status(400).json({ message: "Fill all input fields" });
    }

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const product_data = new productSchema({
      productName,
      productDescription,
      quantity,
      productcode,
      image: image,
    });

    const result = await product_data.save();
    res.status(200).json({ message: "Product added successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get all products



exports.getAllproduct = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    const skip = (page - 1) * size;
    const totalProducts = await productSchema.countDocuments();
    console.log(totalProducts);
    const totalPages = Math.ceil(totalProducts / size);
    console.log(totalPages);

    let getdata = await productSchema.find()
      .skip(skip)
      .limit(size);
    if (!getdata) {
      return res.status(400).json({ message: "data not found" });
    }

    res.status(200).json({ message: "get all products successfully", getdata, currentPage: page, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}




exports.finOneProduct = async (req, res) => {

  let id = req.params.id

  console.log(id, "data..............");
  try {
    let data = await productSchema.findById(id);
    res.status(200).json({ message: " products found successfully", data })

  } catch (error) {
    res.status(404).json({ message: "product not found" });
  }


}

// get updat products

exports.updateProduct = async (req, res) => {
  const id = req.params.id
  const image = req.file ? req.file.path : null;
  const { productName, productDescription, quantity, productcode } = req.body;
  try {
    if (!productName || !productDescription || !quantity || !productcode) {
      return res.status(400).json({ message: "fill all input fields" });
    }

    const updadteproduct = await productSchema.findByIdAndUpdate(
      id,
      { productName, productDescription, quantity, productcode, image },
      { new: true }
    );
    console.log(updadteproduct);

    if (!updadteproduct) {
      return res.status(400).json({ message: "user not updated" });
    }

    res.status(200).json({ message: "product updated succesfully", updadteproduct });

  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }


}

// get delete products

exports.deleteProduct = async (req, res) => {
  const id = req.params.id


  try {
    if (!id) {
      return res.status(400).json({ message: "please provide id !!" })
    }
    let doc = await productSchema.findByIdAndDelete(id)
    if (!doc) {
      return res.status(400).json({ message: "product not deleted any problem an id!!" })

    }
    res.status(200).json({ message: "Product  deleted successfully", doc })



    //let fun=(id,(err,doc)=>{
    //     if(err){
    //       
    //     }

    //     res.status(200).json({message:"Product  deleted successfully",doc})
    //  });




  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}







exports.getQrcode = async (req, res) => {
  const id = req.params.id;

  try {

    const productUrl = `http://localhost:3000/inventory/${id}`;

    //now  Generating the QR code for the URL
    QRCode.toDataURL(productUrl, (err, url) => {
      if (err) {
        return res.status(500).json({ error: 'failed to generate QR code' });
      }

      res.status(200).json({ qrCodeUrl: url });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'failed to process the request' });
  }
}



exports.DecrementQuantity = async (req, res) => {

  try {

    const id = req.params.id;


    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    product.quantity -= 1;
    await product.save();

    res.status(200).json({ message: 'Product quantity Decremented successfully', productQuantity: product.quantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to decremented the product quantity' });
  }
}
exports.IncrementQuantity = async (req, res) => {

  try {

    const id = req.params.id;


    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    product.quantity += 1;
    await product.save();

    res.status(200).json({ message: 'Product quantity Incremented successfully', productQuantity: product.quantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to decrement the product quantity' });
  }
}





// update quantity of the product

exports.updateQuantity = async (req, res) => {
  const id = req.params.id;
  try {
    let { newQuantity } = req.body;

    newQuantity = parseInt(newQuantity);




    const product = await productSchema.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }


    product.quantity += newQuantity;
    await product.save();

    res.status(200).json({ message: 'Product quantity updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the product quantity' });
  }
}