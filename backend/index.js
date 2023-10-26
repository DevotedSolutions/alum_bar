const express=require('express');
const app=express();
let port=1000;
let db=require("./api/db config/db")
app.use(express.json());
var cors = require('cors')
const productsroute=require("./api/routes/product_routes")
app.use(cors({
    origin:'http://localhost:3000'
}));

db();
const rout=require('./api/routes/routes');
app.use('/uploads', express.static('uploads'));
 app.use('/api',rout,productsroute);
app.listen(port,()=>{
    console.log('port is working on 1000');
})