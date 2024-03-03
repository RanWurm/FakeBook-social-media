const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
const postController = require('../controllers/post.js');

router.route('/').post(userController.createUser);
router.route('/tokens').post(userController.login);
router.route('/:id').get(userController.getUserById);
router.route('/:id').patch(userController.editUserById);
router.route('/:id').delete(userController.deleteUserById);
router.route('/:id/posts').get(postController.getPosts);
router.route('/:id/posts/:pid').patch(postController.editPost);
router.route('/:id/posts/:pid').delete(postController.deletePost);
router.route('/:id/:friends').get(userController.getFriendsList);
router.route('/:id/:friends').post(userController.getFriendsList);