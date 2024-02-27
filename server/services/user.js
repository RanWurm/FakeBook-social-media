const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const key = "133221333123111";


const createUser = async(uName,pWord,fakeNick,profPic) => {
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