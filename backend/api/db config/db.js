const mongoose=require('mongoose');
const url='mongodb+srv://waqas:waqas123@cluster0.d5key9b.mongodb.net/'
const db=()=>{
    console.log("DataBase is Successfully connected")
    mongoose.set("strictQuery", false);
      return mongoose.connect(url, {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
      })

    };
    
    module.exports =db;
    