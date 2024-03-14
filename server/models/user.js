const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendRequestSchema = new Schema({
	sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	status: { type: String, enum: [ 'pending', 'accepted', 'denied' ], default: 'pending' },
	createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema({
	userName: { type: String, required: true },
	password: { type: String, required: true },
	nickName: { type: String, required: true },
	profilePicture: { type: String, required: true },
	id: { type: Number, required: true },
	token: { type: String },
	friends: [ { type: Schema.Types.ObjectId, ref: 'User' } ],
	friendRequests: [ FriendRequestSchema ]
});

const User = mongoose.model('User', UserSchema);
const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);

module.exports = { User, FriendRequest };