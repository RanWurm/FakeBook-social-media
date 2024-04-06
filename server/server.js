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

mongoose.connect("mongodb://127.0.0.1:27017/users",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => app.listen(5000, () => console.log("Server 5000")))
	.then(() => console.log('connected to mongodb'))
	.catch((err) => console.log("error!"));