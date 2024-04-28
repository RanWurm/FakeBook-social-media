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
			const user = await User.findById(userID); // Using Mongoose's findById method
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		} catch (error) {
			// Optionally, handle more specific errors if necessary
			throw error;
		}
	}




	editUserById = async (userId, newData) => {
		try {
			const updatedUser = await User.findByIdAndUpdate(userId, newData, {new: true});
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
			return user;
		} catch (error) {
			console.error('Error getting friends list:', error);
			throw error;
		}
	};
}
module.exports = UserService;