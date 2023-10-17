const User = require('../model/schema');

let jwt = require('jsonwebtoken');
let key="waqas";
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all input fields" });
    }

    const userExist = await User.findOne({ email:email });

    if (userExist) {
      return res.status(400).json({ message: "This user already exists. Try with a unique email." });
    }

    const user = new User({ name, email, password });
    const result = await user.save();
 

    res.status(200).json({ message: "User saved successfully", response: result });
  } catch (error) {

    res.status(500).json({ message: "Internal server error" });
  }
};


// login api
exports.login = async (req, res) => {
  const { name, email, password } = req.body;

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
              let token=jwt.sign({email: user.email }, key, { expiresIn: '1h' });


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

































