const express = require('express');
var router = express.Router();
const postController = require('../controllers/post.js');

router.get('/posts/:userId', postController.getPosts);

