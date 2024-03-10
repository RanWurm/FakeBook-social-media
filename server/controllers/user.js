const User = require('../models/user');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.js');
const key = "133221333123111";
const postController = require('../controllers/post.js');

function tokenIsValid(token){
	try {
		const dec = jew.verify(token,key)
		if(dec !== undefined){
			return true;
		}else{
			return false;
		}
	} catch(error){
		return false;
	}
}


export const createUser = async (req,res) => {
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


export const login = async (req,res) => {
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

export const getUserById = async(req,res) =>{
	try{
		const {username} = req.params;
		const user = await userService.getUserById(userName);
		if(user == null){
			return res.status(404).json({error: "user not found!"});
		}
		const {username:userName,nickname:nickName,profilepicture:profilePicture,id:id,token:token,friendsList:friendsList} = user
		res.status(200).json({username:userName,nickname:nickName,profilepicture:profilePicture,id:id,token:token,friendsList:friendsList})
	}catch(error){
		res.status(500).json({error: "something went worng!"})
	}
	
	
} 

export const deleteUserById = async(req,res) =>{
	if(req.headers.authorization){
		const data = req.headers.authorization.split(" ")[1];
		const parsData = JSON.parse(data);
		const token = parsData.token;
		try{
		if(tokenIsValid(token)){
			idToDel = req.params.id;
			await userService.deleteUserById(idToDel,token);
			return res.status(200).json();
		} else{
			return res.status(401).json({error: "invalid Token!"});
		}
		
	}catch(error){
		return res.status(500).json({error:"something went wrong!"});
	}	
}
	return res.status(403).send("token needed!")		

}

export const getFriendsList = async (req, res) => {
	try {
	  const userId = req.params; 
	  const friendsList = await userService.getFriendsList(userId);
	  res.status(200).json(friendsList);
	} catch (error) {
	  res.status(500).json({ error: error.message });
	}
  };

export const editUserById = 0;


