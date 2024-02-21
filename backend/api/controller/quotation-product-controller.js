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
      

        const newDesignation = await designationModel.create({
            designation , vitrage,cermone,priceList,  image: image,
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
         const image = req.file ? req.file.path : null;


         const updatedesign = await designationModel.findByIdAndUpdate(
          id,
          {designation , vitrage,cermone,priceList,image},
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
