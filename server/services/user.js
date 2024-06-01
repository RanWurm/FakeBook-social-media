const { UNSAFE_useRouteId } = require('react-router-dom');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const key = "133221333123111";



module.exports.createUser = async (uName, pWord, fakeNick, profPic) => {
		try {
			const largestId = await User.findOne().sort({id: -1}).limit(1).select('id');
			const userID = largestId ? largestId.id + 1 : 1;
			const user = new User({
				userName: uName,
				password: pWord,
				nickName: fakeNick,
				profilePicture: profPic,
				id: userID
			});
			return await user.save();
		} catch (error) {
			console.log("Some Error:", error);
			throw error;
		}
	};


module.exports.login = async (uName, pWord) => {
		try {
			let user = await User.findOne({userName: uName, password: pWord});
			if (user !== null) {
				const nToken = jwt.sign({ id: user.id, userName: uName }, key);
				user = await User.findOneAndUpdate(
					{ userName: uName },
					{ token: nToken },
					{ new: true }  // Ensures the updated document is returned
				);
				
			}
			return user;
		} catch (error) {
			console.error("Error during login:", error);
			throw error;
		}
	};


	module.exports.getUserById = async (userID) => {
		try {
			const user = await User.findOne({ id: userID });
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		} catch (error) {
			
			throw error;
		}
	};


module.exports.editUserById = async (userId, newData) => {
		try {
			// Use findOneAndUpdate with the custom 'id' field
			const updatedUser = await User.findOneAndUpdate({ id: userId }, newData, { new: true });
			if (!updatedUser) {
				throw new Error("User not found");
			}
			return updatedUser;
		} catch (error) {
			console.error("Error editing user by ID:", error);
			throw error;
		}
	};


module.exports.deleteUserById = async (idToDel) => {
		try {
			const userToDel = await User.findOneAndDelete({id: idToDel});
			return userToDel;
		} catch (error) {
			console.error("Error deleting user by ID:", error);
			throw error;
		}
	};


module.exports.getFriendsList = async (userId) => {
		try {
			const user = await User.findOne({ id: userId });
			if (!user) {
				throw new Error('User not found');
			}
			return user.friends;
		} catch (error) {
			console.error('Error getting friends list:', error);
			throw error;
		}
	};

module.exports.sendFriendRequest = async (senderId, userId) => {
		try {
			const user = await User.findOne({ id: userId });
			if (!user) {
				throw new Error('User not found');
			}
	
			const existingRequest = user.friendRequests.find(
				(request) => request.toString() === senderId.toString()
			);
			if (existingRequest) {
				throw new Error('Friend request already exists');
			}
			user.friendRequests.push(senderId);
			console.log("friend request sent from userId:" + senderId + " to userId:" + userId);
			await user.save();
		} catch (error) {
			console.error('Error sending friend request:', error);
			throw error;  // Re-throw the error to be caught by the controller.
		}
	};

	module.exports.approveFriendRequest = async(requestorId, userId) => {
		const recipient = await User.findOne({ id: userId });
		if (!recipient) {
			throw new Error('Recipient not found');
		}
	
		if (!recipient.friendRequests.includes(requestorId)) {
			throw new Error('Friend request not found');
		}
	
		const sender = await User.findOne({ id: requestorId });
		if (!sender) {
			throw new Error('Sender not found');
		}
	
		// Add each other to friends lists
		recipient.friends.push(requestorId);  // Add sender's ID to recipient's friends list
		sender.friends.push(userId);   // Add recipient's ID to sender's friends list
	
		// Remove the friend request
		recipient.friendRequests.pull(requestorId);  // Remove the sender's ID from recipient's friend requests
		console.log("friend request approved");
		await recipient.save();
		await sender.save();
	};

module.exports.deleteFriend = async(requestorId, deleteId) => {
		const user = await User.findOne({ id: requestorId });
		if (!user) {
			throw new Error('user not found');
		}
	
		if (!user.friends.includes(deleteId)) {
			throw new Error('Friend not found');
		}
	
		const deleted = await User.findOne({ id: deleteId });
		if (!deleted) {
			throw new Error('user to delete not found');
		}
	
		// delete each other from friends lists
		user.friends.pull(deleteId);  // Add sender's ID to recipient's friends list
		deleted.friends.pull(requestorId);   // Add recipient's ID to sender's friends list
		console.log("friendId:" + deleteId+ " was deleted");
		await user.save();
		await deleted.save();
	};

	module.exports.areFriends = async (userId, friendId) => {
		try {
			const user = await User.findOne({ id: userId });
			return user.friends.some(friend => friend.toString() === friendId.toString());
		} catch (error) {
			console.error('Error checking friendship:', error);
			throw error;
		}
	};

	module.exports.verifyUser = (requestedId, userId) => {
		return String(requestedId) === String(userId);
	};
