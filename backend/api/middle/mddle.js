let jwt = require('jsonwebtoken');
let key='waqas'
exports.authVerify=(req,res,next)=>{

const token = req.header('Authorization');
// console.log(req.header('Authorization'));


  if (!token) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  try {
   
    const decoded = jwt.verify(token, key); 

    // res.json({ message: 'Token verified successfully', decoded });
    next();
  } catch (error) {

    res.status(403).json({ message: 'error occured', error: error.message });
  }



   }









// const multer = require('multer');
// const fs = require('fs'); // Add this line to work with file system

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'upload';  // Update with your desired upload directory
    // Create the directory if it doesn't exist
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage }).single('image');

// module.exports = { upload };