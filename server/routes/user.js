const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
const postController = require('../controllers/post.js');
const authenticate = require('../middlewares/auth.js');

//creates the user
router.post('/', userController.createUser); 


//get user by its id
router.route('/:id').get(authenticate, userController.getUserById); 

//edit user by its id
router.route('/:id').patch(authenticate, userController.editUserById);

//delete user by its id
router.route('/:id').delete(authenticate, userController.deleteUserById); 


//get user posts
router.route('/:id/posts').get(authenticate, postController.getUserPosts); 

//creates new post
router.route('/:id/posts').post(authenticate, postController.createPost); 

//edit user post by post id
router.route('/:id/posts/:pid').patch(authenticate, postController.editPost); 

//delete user postpost by id
router.route('/:id/posts/:pid').delete(authenticate, postController.deletePost);


//get friends list of user
router.route('/:id/friends').get(authenticate, userController.getFriendsList); 

//send friend request
router.route('/:id/friends').post(authenticate, userController.sendFriendRequest);

//approve friend request
router.route('/:id/friends/:fid').patch(authenticate, userController.approveFriendRequest); 

//delete friend
router.route('/:id/friends/:fid').delete(authenticate, userController.deleteFriend); 

// Assuming this is inside router.js or a similar file where you set up your routes
router.get('/users/:id/posts-or-details', authenticate, userController.getPostsOrDetails);


module.exports = router;