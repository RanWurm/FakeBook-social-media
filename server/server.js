const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const userRouter = require('./routes/user');
const postsRouter = require('./routes/post');
const tokenRouter = require('./routes/tokens');

//create the Express App
var app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/posts', postsRouter);
app.use('/api/tokens', tokenRouter);

mongoose.connect("mongodb://127.0.0.1:27017/users")
	.then(() => {
		console.log('Connected to MongoDB');
		app.listen(5000, () => console.log("Server running on port 5000"));
	})
	.catch(err => console.error("MongoDB connection error:", err));
