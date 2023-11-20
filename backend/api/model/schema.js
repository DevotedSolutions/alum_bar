const mongoose=require('mongoose')

const UserSchema= mongoose.Schema({
   username:{
    type:String,
    require:true
   },
   email:{
    type:String,
 require:true
   },
   password:{
      type:String,
      require:true
     },
  token:{
   type:String
  }
});

const Userdata=mongoose.model('deveotes-task1',UserSchema);
module.exports=Userdata;

