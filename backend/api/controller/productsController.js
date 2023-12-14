const productSchema = require("../model/productSchema");
const QRCode = require('qrcode');
const mongoose = require('mongoose'); // Import Mongoose

exports.AddProduct = async (req, res) => {
  const { productName, productDescription, quantity, productcode,price } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    if (!productName || !productDescription || !quantity || !productcode || !price) {
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
      price
    });

    const result = await product_data.save();
    res.status(200).json({ message: "Product added successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message});
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
   
    const totalPages = Math.ceil(totalProducts / size);
    

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
  const { productName, productDescription, quantity, productcode } = req.body;
  const image = req.file ? req.file.path : req.body.image;
  
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

    const productUrl = `http://51.20.193.213:3000/api/decrement/${id}`;

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

exports.TotalProducts=async (req,res)=>{
  try {
    const totalProducts = await productSchema.countDocuments();
    res.status(200).json({message:"total products",totalProducts})
  } catch (error) {
    res.status(500).json({ error: 'Failed to get the total number of products' });
  }
}
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProductsCount = await productSchema.countDocuments({ quantity: { $lt: 10 } });
    const lowStockProducts = await productSchema.find({ quantity: { $lt: 10 } });

    if (!lowStockProducts || lowStockProducts.length === 0) {
      return res.status(404).json({ message: 'No low stock products found' });
    }

    res.status(200).json({
      message: 'Low stock products retrieved successfully',
      lowStockProductsCount,
      lowStockProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to retrieve low stock products data' });
  }
};
exports.getMostStockProducts = async (req, res) => {
  try {
    const mostStockProductsCount = await productSchema.countDocuments({ quantity: { $gt: 10 } });
    const mostStockProducts = await productSchema.find({ quantity: { $gt: 10 } });

    res.status(200).json({
      message: 'Most stock products retrieved successfully',
      mostStockProductsCount,
      mostStockProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to retrieve most stock products data' });
  }
};

exports.getTotalRevenue = async (req, res) => {
  try {
    const products = await productSchema.find();

    // Initialize an object to store monthly revenues
    const monthlyRevenues = {};

    products.forEach((product) => {
      // Check if the product has a valid date (you might need to adjust this based on your schema)
      if (product.createdAt && !isNaN(product.quantity) && !isNaN(product.price)) {
        // Extract the month and year from the creation date
        const monthYear = `${product.createdAt.getMonth() + 1}-${product.createdAt.getFullYear()}`;

        // Initialize the monthly revenue for the current month
        if (!monthlyRevenues[monthYear]) {
          monthlyRevenues[monthYear] = 0;
        }

        // Update the monthly revenue
        monthlyRevenues[monthYear] += product.quantity * product.price;
      }
    });

    // Create an array of monthly revenues with default values for each month
    const months = Array.from({ length: 12 }, (_, index) => {
      const monthYear = `${index + 1}-${new Date().getFullYear()}`;
      return { monthYear, revenue: monthlyRevenues[monthYear] || 0 };
    });

    // Calculate total revenue from all months
    const totalRevenue = Object.values(monthlyRevenues).reduce((acc, revenue) => acc + revenue, 0);

    // Get the revenue for the current month
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthRevenue = monthlyRevenues[`${currentMonth}-${new Date().getFullYear()}`] || 0;

    res.status(200).json({
      message: 'Monthly revenues calculated successfully',
      totalRevenue,
      currentMonthRevenue,
      months,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to calculate monthly revenues', error });
  }
};


exports.getTopRatedProducts = async (req, res) => {
  try {
  
    const topRatedProducts = await productSchema
      .find()      .sort({ quantity: -1 })
      .limit(5);

    if (!topRatedProducts || topRatedProducts.length === 0) {
      return res.status(404).json({ message: 'No top-rated products found' });
    }

    console.log(topRatedProducts);
    res.status(200).json({ message: 'Top-rated products retrieved successfully', topRatedProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to retrieve top-rated products data' });
  }
};