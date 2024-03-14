const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

mongoose.connect("mongodb://localhost:27017",
	{ useNewUrlParser: true,
	useUnifiedTopology: true })
	.then(()=>app.listen(5000))
	.then((console.log("connected to mongoDb")))
	.catch((err) =>console.log("error!"));

//create the Express App
var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use("/api",(req,res,next)=>{
	res.send("hello world");
	
})
app.listen(5000);