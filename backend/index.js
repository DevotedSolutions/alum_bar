const express=require('express');
const app=express();
require('dotenv').config();
const port = process.env.PORT || 1000;

let db=require("./api/db config/db")
app.use(express.json());
var cors = require('cors')
const productsroute=require("./api/routes/product_routes")
const quotationroute = require("./api/routes/quotation_routes")
app.use(cors());



db();
const rout=require('./api/routes/routes');
const designationModel = require('./api/model/designationSchema');
app.use('/uploads', express.static('uploads'));
app.use('/quotationuploads', express.static('quotationuploads'));
app.use('/api',rout,productsroute,quotationroute);

app.listen(port,()=>{
    console.log('port is working on 1000');
})