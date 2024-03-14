const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
const postController = require('../controllers/post.js');
const authenticate = require('../middlewares/auth.js');

//creates the user
router.route('/').post(userController.createUser);

//login the user and provide with token
router.route('/tokens').post(userController.login);

//get user by its id
router.route('/:id').get(userController.getUserById);

//get user posts
router.route('/:id/posts').get(postController.getPosts);

//creates new post
router.post('/:id/posts', authenticate, postController.createPost);

//edit user post by post id
router.patch('/:id/posts/posts/:pid', authenticate, postController.editPost);

//edit user by its id
router.route('/:id').patch(userController.editUserById);

//delete user postpost by id
router.delete('/:id/posts/posts/:pid', authenticate, postController.deletePost);


//delete user by its id
router.route('/:id').delete(userController.deleteUserById);

//get friends list of user
router.get('/:id/:friends', userController.getFriendsList);

//send friend request
router.post('/:id/:friends', authenticate, userController.sendFriendRequest);

//approve friend request
router.patch('/:id/:friends/:fid', authenticate, userController.approveFriendRequest);

//denay friend request
router.post('/:id/:friends/:fid', authenticate, userController.denyFriendRequest);

//delete friend from friends list i thought we need to implement this
router.delete('/:id/:friends/:fid/:friendId', authenticate, userController.deleteFriend);









module.exports = router;