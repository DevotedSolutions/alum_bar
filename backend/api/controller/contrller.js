const User = require('../model/schema');
const nodemailer = require("nodemailer");
let jwt = require('jsonwebtoken');
let key="waqas";
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all input fields" });
    }

    const userExist = await User.findOne({ email:email });

    if (userExist) {
      return res.status(400).json({ message: "This user already exists. Try with a unique email." });
    }

    const user = new User({ username, email, password });
    const result = await user.save();
 

    res.status(200).json({ message: "User saved successfully", response: result });
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};


// login api
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all input fields" });
    }

  
           let user = await User.findOne({ email });
            console.log(user);
                  if (!user) {
                       return res.status(404).json({ message: "User not found" });
                   }
          let matchPassword= await user.password===password;
             if(!matchPassword){
              return res.status(404).json({ message: "your password is incorrect" });}
              let token=jwt.sign({email: user.email }, key, { expiresIn: '6h' });


              user.token = token;
              await user.save();
          
               res.status(200).json({ message: "login successfull",user,token })

  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getdata=(req,res)=>{
  let database = [
    {
        name: 'gfg',
        work: 'knowledge provider',
        password: 'abc'
    },
    {
        name: 'suryapratap',
        work: 'technical content writer',
        password: '123'
    }
]

  res.status(200).json({message:"data is get successfully",database})

}

// exports.getUrl=(req,res)=>{
  

// }


// exports.forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const checkEmail = await User.findOne({ email: email });

//     if (!checkEmail) {
//       return res.status(404).json({
//         message: "Email not found",
//       });
//     }

//     // create reusable transporter object using the default SMTP transport
//     const transport = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       service: "gmail",
//       secure: false, // true for 465, false for other ports
//       auth: {
//         user: "waqaskhan26394@gmail.com",
//         pass: "MyCar@2010",
//       },
//       tls: { rejectUnauthorized: false },
//       debug: true, // Add this line for debugging output
//     });

//     // verify transporter
//     transport.verify((error, success) => {
//       if (error) {
//         console.error('Transporter verification failed:', error);
//         // handle verification failure
//         return res.status(400).json({
//           message: 'Transporter verification failed',
//           error: error.message, // include the error message in the response
//         });
//       } else {
//         console.log('Transporter verified');
//         // proceed with sending the email
//         sendPasswordResetEmail(res, transport, checkEmail);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Some error occurred" });
//   }
// };

// // function to send password reset email
// const sendPasswordResetEmail = async (res, transport, user) => {
//   try {
//     let mailOptions = {
//       from: "waqaskhan26394@gmail.com", // sender address
//       to: user.email,
//       subject: "To Reset Password Click On The Link below",
//       html: `<h1> Forgot Password </h1><br>
//         <p><a href="http://localhost:3000/reset-password/${user._id}">Click Here to change password</a></p>`,
//     };

//     // send email with defined transport object
//     let info = await transport.sendMail(mailOptions);
//     return res.status(200).json({
//       message: "Email Sent",
//       info,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "Error sending email" });
//   }
// };

  
  
  
//   exports.resetpassword = async (req, res) => {
//     try {
//       const userId = req.params.id;
//       const { newPassword } = req.body;
    
//       const user = await User.findById(userId);
   
//       if (!user) {
//         return res.status(404).json({
//           message: "User not found",
//         });
//       } else {
//         user.password = newPassword;
//         await user.save();
//         return res.status(200).json({
//           message: "Password updated successfully",
//         });
//       }
//     } catch (error) {
//       console.error(error); // Log the error message for debugging
//       return res.status(500).json({
//         message: "Server error",
//       });
//     }
//   };
  






























