const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.js');


const createUser = async (req,res) => {
	try{
		const {userName,password,nickName,profilePicture} = req.body;
		const isUserNameExist = await User.findOne({userName});
		
		if(isUserNameExist){
		res.status(409).json({error:'user Name is taken'});
		}
		const user = await userService.createUser(username,password,nickName,profilePicture);
		const {username: userName1, password:userPassword, nickName: userNickName, profilePicture: userProfilePic } = user;
		res.status(200).json({username: userName1, password:userPassword, nickName: userNickName, profilePicture: userProfilePic });
	} catch(error){
		res.status(500).json({ error: 'faild to Register' });
	}	
};


const login = async (req,res) => {
	try{
		const {userName,password} = req.body;
		const user = await userService.login(userName,password);
		if(!user){
			return res.status(404).json({error: "Invalid username or password"});
		}
		res.status(200).json({token:user.token});
		
	} catch(error){
		res.status(500).json({error:"Something went Wrong!"});
	}
};

const getUserById = 0;
const editUserById = 0;
const deleteUserById = 0;
const getFriendsList = 0;
module.exports = { createUser,login};