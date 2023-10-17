const express=require('express');
const app=express();
let port=1000;
let db=require("./api/db config/db")
app.use(express.json());
var cors = require('cors')
app.use(cors({
    origin:'http://localhost:3000'
}));

db();
const rout=require('./api/routes/routes');
 app.use('/api',rout);
app.listen(port,()=>{
    console.log('port is working on 1000');
})