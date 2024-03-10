const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
const postController = require('../controllers/post.js');

//done section{

//creates the user
router.route('/').post(userController.createUser);
//login the user and provide with token
router.route('/tokens').post(userController.login);
router.route('/:id').get(userController.getUserById);
//delete user
router.route('/:id').delete(userController.deleteUserById);

// }

//In The making Section{
	router.route('/:id/:friends').get(userController.getFriendsList);
//}



//TODO Section{

router.route('/:id').patch(userController.editUserById);

router.route('/:id/posts').get(postController.getPosts);
router.route('/:id/posts/:pid').patch(postController.editPost);
router.route('/:id/posts/:pid').delete(postController.deletePost);
router.route('/:id/:friends').get(userController.getFriendsList);
router.route('/:id/:friends').post(userController.getFriendsList);

//}