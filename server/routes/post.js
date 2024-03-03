const express = require('express');
var router = express.Router();
const postController = require('../controllers/post.js');

router.route('/').get(postController.getPosts);

