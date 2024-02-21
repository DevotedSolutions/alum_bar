const mongoose=require('mongoose');


const url='mongodb+srv://devotedsol:4duUvJP1ncmcMX9d@dasbysystems.ewuay86.mongodb.net/'
//const url="mongodb+srv://waqas:waqas321@cluster0.d5key9b.mongodb.net/"
const db=()=>{
    console.log("DataBase is Successfully connected")
    mongoose.set("strictQuery", false);
      return mongoose.connect(url, {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
      })

    };
    
    module.exports =db;
    