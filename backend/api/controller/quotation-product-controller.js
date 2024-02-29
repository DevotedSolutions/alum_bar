const designationModel = require("../model/designationSchema");
const gammeModel = require('../model/gammeSchema');
const productSchema = require('../model/productSchema')
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
  
      res
        .status(200)
        .json({
          message: "get all products successfully",
          getdata,
          currentPage: page,
          totalPages,
        });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };



exports.getGamme = async (req,res) =>{

  try {

    const getAllGamme = await gammeModel.find();

    if(!getAllGamme){
      return res.status(400).json({ message: "data not found" });
    }
    res
    .status(200)
    .json({
      message: "get all gamme successfully",
      getAllGamme
    });
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
}




exports.addDesignation = async(req,res) =>{

    
    try {
        const {designation , vitrage,cermone,priceList} = req.body;
       
       

        const image = req.file ? req.file.path : null;
        const updatedPriceList = priceList !== undefined ? priceList : [];
        const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
         return priceList.findIndex(
             (entry, i) => i !== index && entry.width === priceEntry.width && entry.height === priceEntry.height
         ) !== -1;
     });

     if (duplicateCombination) {
         return res.status(400).json({ message: "Duplicate width and height combination found in priceList" });
     }

      

        const newDesignation = await designationModel.create({
            designation , vitrage,cermone,priceList:updatedPriceList,  image: image,
        })

        if(!newDesignation){
            return res.status(404).json({message:"Error in saving designation"})
        }
        
        res.status(200).json({message:"Designation saved successfully"})
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }


}

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


exports.updateDesignation = async(req,res)=>{
  
  try {
         const id = req.params.id;
         const {designation , vitrage,cermone,priceList} = req.body;
         const image = req.file ? req.file.path : req.body.image;
         const updatedPriceList = priceList !== undefined ? priceList : [];
         const duplicateCombination = updatedPriceList?.some((priceEntry, index) => {
          return priceList.findIndex(
              (entry, i) => i !== index && entry.width === priceEntry.width && entry.height === priceEntry.height
          ) !== -1;
      });

      if (duplicateCombination) {
          return res.status(400).json({ message: "Duplicate width and height combination found in priceList" });
      }

         const updatedesign = await designationModel.findByIdAndUpdate(
          id,
          {designation , vitrage,cermone,priceList:updatedPriceList,image},
          { new: true }
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

}


exports.getDesignation = async (req, res) => {
  try {
    let { page, size } = req.query;
    page = parseInt(page);
    size = parseInt(size);
    const skip = (page - 1) * size;
    const totalProducts = await designationModel.countDocuments();

    const totalPages = Math.ceil(totalProducts / size);

    let getdata = await designationModel.find().sort({ designation: 1 }).skip(skip).limit(size);
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
      return res.status(400).json({ message: "Invalid ID, width, or height provided" });
    }

    const designation = await designationModel.findById(id);

    if (!designation) {
      return res.status(404).json({ message: "Designation not found for the given ID" });
    }

    const { priceList } = designation;
    const numWidth = Number(width);
    const numHeight = Number(height);
    const matchedPrice = priceList.find(item => item.width === numWidth && item.height === numHeight);
  

    if (!matchedPrice) {
      return res.status(404).json({ message: "Price not found for given dimensions" });
    }

    res.status(200).json({
      message: "Price found for given dimensions",
      price: matchedPrice.price
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
      return res.status(200).json({ message: "Price list is empty for this product", minWidth: 0, maxWidth: 0, minHeight: 0, maxHeight: 0 });
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
      maxHeight
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


