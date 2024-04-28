const express = require('express');
var router = express.Router();
const postController = require('../controllers/post.js');
const authenticate = require('../middlewares/auth.js');

router.get('/p/:author', postController.getPosts);

router.post('/createPost', authenticate, postController.createPost);

router.post('/editPost', authenticate, postController.editPost);

router.delete('/deletePost', authenticate, postController.deletePost);


module.exports = router;