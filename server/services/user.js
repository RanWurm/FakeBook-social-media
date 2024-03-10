const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const key = "133221333123111";


export const createUser = async(uName,pWord,fakeNick,profPic) => {
	try{
		const largestId = await User.findOne().sort({ id: -1 }).limit(1).select('id');
		const userID = largestId ? largestId.id + 1 : 1;
		const user = new User ({
			userName: uName,
			password: pWord,
			nickName: fakeNick,
			profilePicture :profPic,
			id: userID
		});
		return await user.save();	
	} catch (error){
		console.log("some Error");
	}
};

export const login = async (uName,pWord) =>{
	let user = await User.findOne({userName: uName,password:pWord});
	if (user != null){
		const nToken = jwt.sign({userName:uName}, key);
		user = await User.findOneAndUpdate(
			{userName: uName},
			{token: nToken}
		);
	}
	return user;
	
}


export const getUserById = async(userName) =>{
	const user = awat.User.findOne(userName);
	return user;
}

export const editUserById = 0;
	
	

export const deleteUserById = async (idToDel, token) => {
	try {
	  // Find the user by ID and token, and delete the user
	  const userToDel = await User.findOneAndDelete({
		id: idToDel,
		token: token
	  });
	  if (!userToDel) {
		return null; 
	  }
	  return userToDel;
	} catch (error) {
	  throw error;
	}
  };
  
  
  export const getFriendsList = async (userId) => {
	try {
	  const user = await User.findById(userId).populate('firendList');
	  if (!user) {
		throw new Error('User not found');
	  }
	  return user.firendList; // Assuming the correct key is 'friendList'
	} catch (error) {
	  console.error('Error getting friends list:', error);
	  throw error;
	}
  };