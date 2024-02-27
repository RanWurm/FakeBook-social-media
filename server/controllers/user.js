const tokenMap = new Map();
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
	
}