const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
	userName: {
		type : String,
		required: true
	},
	password:{
		type : String,
		required: true
	},
	nickName :{
		type : String,
		required: true
	},
	profilePicture:{
		type : String,
		required: true
	},
	id: {
		type : Number,
		required: true
	},
	token: {
        type: String
    }	
})
module.exports = mongoose.model('User', User);