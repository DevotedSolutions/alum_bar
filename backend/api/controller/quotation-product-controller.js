const designationModel = require("../model/designationSchema");
const gammeModel = require("../model/gammeSchema");
const productSchema = require("../model/productSchema");
const quoteSchema = require("../model/QuoteSchema");
const Client = require("../model/client");
// get all products
exports.getProducts = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    const skip = (page - 1) * size;
    const totalProducts = await productSchema.countDocuments();

    const totalPages = Math.ceil(totalProducts / size);

    let getdata = await productSchema.find().skip(skip).limit(size);
    if (!getdata) {
      return res.status(400).json({ message: "data not found" });
    }

    res.status(200).json({
      message: "get all products successfully",
      getdata,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getGamme = async (req, res) => {
  try {
    const getAllGamme = await gammeModel.find();

    if (!getAllGamme) {
      return res.status(400).json({ message: "data not found" });
    }
    res.status(200).json({
      message: "get all gamme successfully",
      getAllGamme,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addDesignation = async (req, res) => {
  try {
    const { designation, vitrage, cermone, priceList, category } = req.body;

    const image = req.file ? req.file.path : null;
    const updatedPriceList = priceList !== undefined ? priceList : [];
    const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
      return (
        priceList.findIndex(
          (entry, i) =>
            i !== index &&
            entry.width === priceEntry.width &&
            entry.height === priceEntry.height
        ) !== -1
      );
    });

    if (duplicateCombination) {
      return res.status(400).json({
        message: "Duplicate width and height combination found in priceList",
      });
    }

    const newDesignation = await designationModel.create({
      designation,
      vitrage,
      cermone,
      priceList: updatedPriceList,
      image: image,
      category,
    });

    if (!newDesignation) {
      return res.status(404).json({ message: "Error in saving designation" });
    }

    res.status(200).json({ message: "Designation saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.addDesignation = async (req, res) => {
//   try {
//       const designations = req.body;
//       console.log(designations);

//       // Iterate over each designation in the array
//       for (const { designation, vitrage, cermone, priceList } of designations) {
//           // Create a new designation in the database
//           await designationModel.create({ designation, vitrage, cermone, priceList });
//       }

//       res.status(200).json({ message: "Designations saved successfully" });
//   } catch (error) {
//       res.status(500).json({ message: error.message });
//   }
// };

exports.updateDesignation = async (req, res) => {
  try {
    const id = req.params.id;
    const { designation, vitrage, cermone, priceList, category } = req.body;
    const image = req.file ? req.file.path : req.body.image;
    const updatedPriceList = priceList !== undefined ? priceList : [];
    const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
      return (
        priceList.findIndex(
          (entry, i) =>
            i !== index &&
            entry.width === priceEntry.width &&
            entry.height === priceEntry.height
        ) !== -1
      );
    });

    if (duplicateCombination) {
      return res.status(400).json({
        message: "Duplicate width and height combination found in priceList",
      });
    }
    console.log("Category:", category);
    const updatedesign = await designationModel.findByIdAndUpdate(
      id,
      {
        designation,
        vitrage,
        cermone,
        priceList: updatedPriceList,
        image,
        category,
      },
      { new: true, runValidators: true }
    );

    if (!updatedesign) {
      return res.status(400).json({ message: "user not updated" });
    }

    res
      .status(200)
      .json({ message: "designation updated succesfully", updatedesign });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDesignation = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    const skip = (page - 1) * size;
    const totalProducts = await designationModel.countDocuments();

    const totalPages = Math.ceil(totalProducts / size);

    let getdata = await designationModel
      .find()
      .sort({ designation: 1 })
      .skip(skip)
      .limit(size);
    if (!getdata) {
      return res.status(400).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Get all designations successfully",
      getdata,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedDesignation = await designationModel.findByIdAndDelete(id);

    if (!deletedDesignation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.status(200).json({ message: "Designation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkPrice = async (req, res) => {
  try {
    const { id, width, height } = req.query;

    // Validate ID, width, and height
    if (!id || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid ID, width, or height provided" });
    }

    const designation = await designationModel.findById(id);

    if (!designation) {
      return res
        .status(404)
        .json({ message: "Designation not found for the given ID" });
    }

    const { priceList } = designation;
    const numWidth = Number(width);
    const numHeight = Number(height);
    const matchedPrice = priceList.find(
      (item) => item.width === numWidth && item.height === numHeight
    );

    if (!matchedPrice) {
      return res
        .status(404)
        .json({ message: "Price not found for given dimensions" });
    }

    res.status(200).json({
      message: "Price found for given dimensions",
      price: matchedPrice.price,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMinAndMaxDimensions = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await designationModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Extract priceList from product
    const { priceList } = product;

    if (!priceList || priceList.length === 0) {
      return res.status(200).json({
        message: "Price list is empty for this product",
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
      });
    }

    let minWidth = priceList[0].width;
    let maxWidth = priceList[0].width;
    let minHeight = priceList[0].height;
    let maxHeight = priceList[0].height;

    for (const { width, height } of priceList) {
      if (width < minWidth) {
        minWidth = width;
      }
      if (width > maxWidth) {
        maxWidth = width;
      }
      if (height < minHeight) {
        minHeight = height;
      }
      if (height > maxHeight) {
        maxHeight = height;
      }
    }

    res.status(200).json({
      message: "Minimum and maximum dimensions retrieved successfully",
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveQuotes = async (req, res) => {
  try {
    const quotes = req.body;

    const savedQuotes = await quoteSchema.insertMany(quotes);

    res.status(201).json({
      message: "Quotes saved successfully!",
      data: savedQuotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while saving quotes",
      error: error.message,
    });
  }
};

exports.getAllQuotesSorted = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const user = req.user;

    // Build the query object
    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      query.createdAt = { $lte: new Date(endDate) };
    }
    if (user.role === "user") {
      query.createdBy = user.userId;
    }

    // Find and sort the quotes
    const quotes = await quoteSchema.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Quotes retrieved and sorted successfully",
      data: quotes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while retrieving and sorting quotes",
      error: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedOrder = await quoteSchema.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const quote = req.body;
    const updateOrder = await quoteSchema.findByIdAndUpdate(
      id,
      {
        ...quote,
      },
      { new: true, runValidators: true }
    );

    if (!updateOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteQuotation = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedOrder = await Client.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    res.status(200).json({ message: "quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveQuotation = async (req, res) => {
  const { clientName, email, phone } = req.body;

  const file = req.file ? req.file.path : null;
  try {
    const newClient = new Client({
      clientName,
      email,
      phone,
      filePath: file,
    });

    await newClient.save(); // Save the client info to MongoDB

    res.send("File uploaded and client info saved successfully");
  } catch (error) {
    res.status(500).send("Error saving client info to MongoDB");
  }
};

exports.getQuotations = async (req, res) => {
  try {
    const clients = await Client.find();

    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).send("Error fetching client information");
  }
};
