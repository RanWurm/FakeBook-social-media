const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');

mongoose.connect(process.env.CONNECTION_STRING,
	{ useNewUrlParser: true,
	useUnifiedTopology: true });

//create the Express App
var app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.listen(5000);