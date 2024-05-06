const { UNSAFE_useRouteId } = require('react-router-dom');
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const key = "133221333123111";

class UserService {

	createUser = async (uName, pWord, fakeNick, profPic) => {
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
			console.log(user);
			return await user.save();
		} catch (error) {
			console.log("Some Error:", error);
			throw error;
		}
	};


	login = async (uName, pWord) => {
		try {
			let user = await User.findOne({userName: uName, password: pWord});
			if (user !== null) {
				const nToken = jwt.sign({ id: user._id, userName: uName }, key);
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


	async getUserById(userID){
		try {
			const user = await User.findOne({ id: userID });
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		} catch (error) {
			
			throw error;
		}
	}




	editUserById = async (userId, newData) => {
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


	deleteUserById = async (idToDel, token) => {
		try {
			const userToDel = await User.findOneAndDelete({id: idToDel, token});
			return userToDel;
		} catch (error) {
			console.error("Error deleting user by ID:", error);
			throw error;
		}
	};


	getFriendsList = async (userId) => {
		try {
			const user = await User.findById(userId);
			if (!user) {
				throw new Error('User not found');
			}
			return user.friends;
		} catch (error) {
			console.error('Error getting friends list:', error);
			throw error;
		}
	};

	sendFriendRequest = async (senderId, userId) => {
		try {
			const user = await User.findById(userId);
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
			await user.save();
		} catch (error) {
			console.error('Error sending friend request:', error);
			throw error;  // Re-throw the error to be caught by the controller.
		}
	};

	async approveFriendRequest(requestorId, userId) {
		const recipient = await User.findById(userId);
		if (!recipient) {
			throw new Error('Recipient not found');
		}
	
		if (!recipient.friendRequests.includes(requestorId)) {
			throw new Error('Friend request not found');
		}
	
		const sender = await User.findById(requestorId);
		if (!sender) {
			throw new Error('Sender not found');
		}
	
		// Add each other to friends lists
		recipient.friends.push(requestorId);  // Add sender's ID to recipient's friends list
		sender.friends.push(userId);   // Add recipient's ID to sender's friends list
	
		// Remove the friend request
		recipient.friendRequests.pull(requestorId);  // Remove the sender's ID from recipient's friend requests
	
		await recipient.save();
		await sender.save();
	}

	async deleteFriend(requestorId, deleteId) {
		const user = await User.findById(requestorId);
		if (!user) {
			throw new Error('user not found');
		}
	
		if (!user.friends.includes(deleteId)) {
			throw new Error('Friend not found');
		}
	
		const deleted = await User.findById(deleteId);
		if (!deleted) {
			throw new Error('user to delete not found');
		}
	
		// delete each other from friends lists
		user.friends.pull(deleteId);  // Add sender's ID to recipient's friends list
		deleted.friends.pull(requestorId);   // Add recipient's ID to sender's friends list
	
		await user.save();
		await deleted.save();
	}

	areFriends = async (userId, friendId) => {
		try {
			const user = await User.findById(userId).populate('friends');
			return user.friends.some(friend => friend._id.toString() === friendId);
		} catch (error) {
			console.error('Error checking friendship:', error);
			throw error;
		}
	};

	verifyUser = (requestedId, userId) => {
		return requestedId === userId;
	}
}
module.exports = UserService;