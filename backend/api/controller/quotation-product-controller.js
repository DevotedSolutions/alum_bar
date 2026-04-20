const designationModel = require("../model/designationSchema");
const combosModel = require("../model/Combo");
const gammeModel = require("../model/gammeSchema");
const productSchema = require("../model/productSchema");
const DiscountSchema = require("../model/DiscountSchema");
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
    const { designation, vitrage, cermone, priceList, priceFactor, category } =
      req.body;

    const image = req.file ? req.file.path : null;
    const updatedPriceList = priceList !== undefined ? priceList : [];
    const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
      return (
        priceList.findIndex(
          (entry, i) =>
            i !== index &&
            entry.width === priceEntry.width &&
            entry.height === priceEntry.height,
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
      priceFactor,
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
    const { designation, vitrage, cermone, priceList, priceFactor, category } =
      req.body;
    const image = req.file ? req.file.path : req.body.image;
    const updatedPriceList = priceList !== undefined ? priceList : [];
    const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
      return (
        priceList.findIndex(
          (entry, i) =>
            i !== index &&
            entry.width === priceEntry.width &&
            entry.height === priceEntry.height,
        ) !== -1
      );
    });

    if (duplicateCombination) {
      return res.status(400).json({
        message: "Duplicate width and height combination found in priceList",
      });
    }
    console.log("Category:", category);
    console.log(priceFactor, "price factor");
    const updatedesign = await designationModel.findByIdAndUpdate(
      id,
      {
        designation,
        vitrage,
        cermone,
        priceList: updatedPriceList,
        priceFactor,
        image,
        category,
      },
      { new: true, runValidators: true },
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
    const { id, width, height, country } = req.query;

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
      (item) => item.width === numWidth && item.height === numHeight,
    );

    if (!matchedPrice) {
      return res
        .status(404)
        .json({ message: "Price not found for given dimensions" });
    }

    // Fetch discount data
    const discount = await DiscountSchema.findOne({});

    let basePrice =
      country === "mru"
        ? matchedPrice?.price_local
        : country === "may"
          ? matchedPrice?.price_may
          : country === "reu"
            ? matchedPrice?.price_reu
            : matchedPrice.price;

    // Apply discount if available
    let finalPrice = basePrice;
    if (discount) {
      const discountValue =
        country === "mru"
          ? discount.mru
          : country === "may"
            ? discount.may
            : country === "reu"
              ? discount.reu
              : discount.others;

      if (discountValue > 0) {
        finalPrice = parseInt(basePrice - (basePrice * discountValue) / 100);
      }
    }

    res.status(200).json({
      message: "Price found for given dimensions",
      price: finalPrice,
      basePrice: basePrice,
      discountApplied: discount ? true : false,
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
      query.createdBy = user.username;
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
      { new: true, runValidators: true },
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

generateDevisNumber = async (country) => {
  try {
    // Map countries to their prefix codes
    const countryPrefixes = {
      MRU: "20",
      May: "10",
      REU: "30",
    };

    // Get the prefix for the country
    const prefix = countryPrefixes[country] ?? "40";

    // Create the pattern to search for (e.g., "DPSW 10-%")
    const searchPattern = `DPSW ${prefix}-%`;

    // Find the latest devis number for this country
    const latestClient = await Client.findOne({
      devisNumber: { $regex: "^DPSW 20-.*" },
    }).sort({ devisNumber: -1 });

    let newNumber = 1;

    if (latestClient && latestClient.devisNumber) {
      // Extract the number part from the devis number
      // e.g., "DPSW 10-0544" -> "0544" -> 544
      const currentNumber = parseInt(latestClient.devisNumber.split("-")[1]);
      newNumber = currentNumber + 1;
    }

    // Format the new number with leading zeros (4 digits)
    const formattedNumber = String(newNumber).padStart(4, "0");

    // Create the new devis number
    const newDevisNumber = `DPSW ${prefix}-${formattedNumber}`;

    return newDevisNumber;
  } catch (error) {
    console.error("Error generating devis number:", error);
    return `DPSW-0000`;
  }
};

exports.saveQuotation = async (req, res) => {
  const { clientName, email, phone, country, devisNumber } = req.body;

  const file = req.file ? req.file.path : null;
  try {
    const devisNumber = await generateDevisNumber(country);
    console.log(devisNumber, "devis number");

    const newClient = new Client({
      clientName,
      devisNumber,
      email,
      phone,
      filePath: file,
    });

    await newClient.save(); // Save the client info to MongoDB

    res.json({
      message: "File uploaded and client info saved successfully",
      devisNumber,
    });
  } catch (error) {
    res.status(500).send("Error saving client info to MongoDB");
  }
};

exports.saveFile = async (req, res) => {
  const { devisNumber } = req.body;
  const file = req.file ? req.file.path : null;

  try {
    // Check if file was uploaded
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // Update the client with the file path
    const updateClient = await Client.updateOne(
      {
        devisNumber: devisNumber,
      },
      {
        $set: {
          filePath: file,
        },
      },
    );

    if (updateClient[0] === 0) {
      return res.status(404).send("Client with this devis number not found");
    }

    res.send("File uploaded and client info saved successfully");
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).send("Error saving client info to database");
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

exports.addCombo = async (req, res) => {
  try {
    let { name, list } = req.body;

    // If list comes in as a string (because of FormData), parse it
    if (typeof list === "string") {
      try {
        list = JSON.parse(list);
      } catch (e) {
        return res.status(400).json({ message: "Invalid list format" });
      }
    }

    const image = req.file ? req.file.path : null;

    const newCombo = await combosModel.create({
      name, // This is the "name" field Mongoose was complaining about
      list, // The array of designations
      image: image,
    });

    res
      .status(200)
      .json({ message: "Combo saved successfully", data: newCombo });
  } catch (error) {
    // If Mongoose validation fails, this will now show you exactly why
    res.status(500).json({ message: error.message });
  }
};

exports.getCombos = async (req, res) => {
  try {
    const combos = await combosModel.find().sort({ name: 1 });

    res.status(200).json({ combos, message: "Combos retrieved successfully" });
  } catch (error) {
    console.error("Error fetching combos:", error);
    res.status(500).send("Error fetching combo information");
  }
};

exports.updateCombo = async (req, res) => {
  try {
    const { id, name, list } = req.body; // 'id' sent from frontend formData

    let updateData = { name };

    // 1. Handle List Parsing
    if (list) {
      updateData.list = typeof list === "string" ? JSON.parse(list) : list;
    }

    // 2. Handle Image Update (only if new file is uploaded)
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedCombo = await combosModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }, // returns the modified document
    );

    if (!updatedCombo) {
      return res.status(404).json({ message: "Combo not found" });
    }

    res
      .status(200)
      .json({ message: "Combo updated successfully", data: updatedCombo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCombo = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCombo = await combosModel.findByIdAndDelete(id);
    if (!deletedCombo) {
      return res.status(404).json({ message: "Combo not found" });
    }
    res.status(200).json({ message: "Combo deleted successfully" });
  } catch (error) {
    console.error("Error deleting combo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveDiscount = async (req, res) => {
  try {
    const { mru, may, reu, others } = req.body;

    const newDiscount = await DiscountSchema.findOneAndUpdate(
      {},
      { mru, may, reu, others },
      { upsert: true, new: true },
    );
    res
      .status(200)
      .json({ message: "Discount saved successfully", data: newDiscount });
  } catch (error) {
    console.error("Error saving discount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
