const { User, FriendRequest } = require('../models/user');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.js');
const key = "133221333123111";
const postController = require('../controllers/post.js');
const { ObjectId } = require('mongoose').Types;

function tokenIsValid (token) {
	try {
		const dec = jwt.verify(token, key);
		if (dec !== undefined) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

module.exports.createUser = async (req, res) => {
	try {
		const { userName, password, nickName, profilePicture } = req.body;

		// Check if the username already exists
		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			return res.status(409).json({ error: 'Username is already taken' });
		}
		const newUser = await userService.createUser(userName, password, nickName, profilePicture);
		res.status(201).json(newUser);
	} catch (error) {
		console.error('Failed to register:', error);
		res.status(500).json({ error });
	}
};

module.exports.login = async (req, res) => {
	try {
		const { userName, password } = req.body;
		const user = await userService.login(userName, password);
		if (!user) {
			return res.status(404).json({ error: "Invalid username or password" });
		}
		res.status(200).json({ user });

	} catch (error) {
		res.status(500).json({ error: "Something went wrong!" });
	}
};

module.exports.getUserById = async (req, res) => {
	const { username } = req.query;
	try {
		const user = await userService.getUserById(username);
		if (user == null) {
			return res.status(404).json({ error: "User not found!" });
		}
		const { username: userName, nickname: nickName, profilepicture: profilePicture, id, token, friendsList } = user;
		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error: "Something went wrong!" });
	}
};

module.exports.deleteUserById = async (req, res) => {
	try {
		const { id: idToDel } = req.params;
		const { token } = req.body;
		const user = await userService.deleteUserById(Number(idToDel), token);
		return res.status(200).json({ msg: "User Deleted", user, id: idToDel });
	} catch (error) {
		return res.status(500).json({ error: "Something went wrong!" });
	}
};


module.exports.getFriendsList = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await userService.getFriendsList(id);
		res.status(200).json({ friendList: user.friends });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports.getPosts = async (req, res) => {
	try {
		res.json('get user post ');
	} catch (error) {
		res.json('Error');
	}
};


module.exports.editUserById = async (req, res) => {
	try {
		const { id } = req.query;
		const { newData } = req.body;
		if (!id || !newData) {
			return res.status(400).json({ error: "Bad request, missing parameters" });
		}

		const updatedUser = await User.findByIdAndUpdate(id, newData, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		return res.status(200).json({ message: "User updated successfully", user: updatedUser });
	} catch (error) {
		console.error('Error editing user:', error);
		return res.status(500).json({ error: "Internal server error" });
	}
};


module.exports.sendFriendRequest = async (req, res) => {
	try {
		const { senderId, recipientId } = req.params;
		const sender = await User.findById(senderId);
		const recipient = await User.findById(recipientId);

		const existingRequest = recipient.friendRequests.find(
			(request) => request.sender.toString() === senderId.toString()
		);

		if (existingRequest) {
			res.json({ error: 'Friend request already exists' });
			return;
		}

		const newRequest = new FriendRequest({
			sender: senderId,
			recipient: recipientId
		});

		recipient.friendRequests.push(newRequest);
		await recipient.save();

		res.json({ message: 'Req sent successfully' });
	} catch (error) {
		res.json({ error: error.message });
	}
};


module.exports.approveFriendRequest = async (req, res) => {
	try {
		const { recipientId, requestId } = req.params;
		const recipient = await User.findById(recipientId);
		const request = recipient.friendRequests.id(requestId);

		if (!request) {
			return res.status(404).json({ error: 'Friend request not found' });
		}

		request.status = 'accepted';
		recipient.friends.push(request.sender);
		const sender = await User.findById(request.sender);
		sender.friends.push(recipientId);
		recipient.friendRequests.pull(requestId);
		await recipient.save();
		await sender.save();
		return res.status(200).json({ message: 'Friend request approved successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};


module.exports.denyFriendRequest = async (req, res) => {
	try {
		const { recipientId, requestId } = req.params;

		const recipient = await User.findById(recipientId);
		const request = recipient.friendRequests.id(requestId);

		if (!request) {
			return res.json({ error: 'Friend request not found' });
		}

		recipient.friendRequests.pull(requestId);
		await recipient.save();

		res.json({ message: 'Friend request denied successfully' });
	} catch (error) {
		res.json({ error: error.message });
	}
};


module.exports.deleteFriend = async (req, res) => {
	try {
		const { userId, friendId } = req.params;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: 'User not found' });
		}
		user.friends = user.friends.filter(
			(friend) => String(friend) !== friendId
		);
		await user.save();
		const friend = await User.findById(friendId);
		if (!friend) {
			return res.status(404).json({ error: 'Friend not found' });
		}
		friend.friends = friend.friends.filter(
			(friendObj) => String(friendObj) !== userId
		);
		await friend.save();
		return res.status(200).json({ message: 'Friend removed successfully' });
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
};

module.exports.getAllUser = async (req, res) => {
	try {
		const { excludedUserId } = req.query;

		const query = excludedUserId
			? { _id: { $ne: excludedUserId } }
			: {};

		const users = await User.find(query, '-token');
		res.status(200).json(users);
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};