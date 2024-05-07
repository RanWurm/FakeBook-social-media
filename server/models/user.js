const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: { type: String, required: true },
	password: { type: String, required: true },
	nickName: { type: String, required: true },
	profilePicture: { type: String, required: true },
	id: { type: Number, required: true },
	token: { type: String },
	friends: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
	friendRequests: [ { type: Schema.Types.ObjectId, ref: 'User' } ]
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };