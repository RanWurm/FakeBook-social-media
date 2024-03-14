const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
const postController = require('../controllers/post.js');
const authenticate = require('../middlewares/auth.js');

//done section{

//creates the user
router.route('/').post(userController.createUser);
//login the user and provide with token
router.route('/tokens').post(userController.login);
// will change this too get req
router.route('/getUser').get(userController.getUserById);
//delete user
// router.route('/deleteUser').delete(userController.deleteUserById);
router.route('/:id').delete(userController.deleteUserById);
//get friends list of user
router.route('/:id/:friends').post(userController.getFriendsList);

// }

//In The making Section{
router.route('/:id/posts').get(userController.getPosts);
//}
// TODO
router.route('/:id').patch(userController.editUserById);
router.post('/:senderId/sendFriendRequest/:recipientId', authenticate, userController.sendFriendRequest);
router.patch('/:recipientId/friends/:requestId', authenticate, userController.approveFriendRequest);
router.post('/:recipientId/friends/:requestId', authenticate, userController.denyFriendRequest);
router.delete('/:userId/friends/:friendId', authenticate, userController.deleteFriend);
router.get('/:id/:friends', userController.getFriendsList);


module.exports = router;