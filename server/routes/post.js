const express = require('express');
var router = express.Router();
const postController = require('../controllers/post.js');
const authenticate = require('../middlewares/auth.js');

router.route('/').get(authenticate, postController.getFeedPosts); 


module.exports = router;