const { User } = require('../models/user.js');
const jwt = require('jsonwebtoken');
const key = "133221333123111";

module.exports.createUser = async (uName, pWord, fakeNick, profPic) => {
	try {
		const largestId = await User.findOne().sort({ id: -1 }).limit(1).select('id');
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

module.exports.login = async (uName, pWord) => {
	try {
		let user = await User.findOne({ userName: uName, password: pWord });
		if (user !== null) {
			const nToken = jwt.sign({ userName: uName }, key);
			user = await User.findOneAndUpdate(
				{ userName: uName },
				{ token: nToken }
			);
		}
		return user;
	} catch (error) {
		console.error("Error during login:", error);
		throw error;
	}
};

module.exports.getUserById = async (userName) => {
	try {
		const user = await User.findOne({ userName });
		return user;
	} catch (error) {
		console.error("Error getting user by ID:", error);
		throw error;
	}
};

module.exports.editUserById = async (userId, newData) => {
	try {
		const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });
		return updatedUser;
	} catch (error) {
		console.error("Error editing user by ID:", error);
		throw error;
	}
};

module.exports.deleteUserById = async (idToDel, token) => {
	try {
		const userToDel = await User.findOneAndDelete({ id: idToDel, token });
		return userToDel;
	} catch (error) {
		console.error("Error deleting user by ID:", error);
		throw error;
	}
};

module.exports.getFriendsList = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	} catch (error) {
		console.error('Error getting friends list:', error);
		throw error;
	}
};
