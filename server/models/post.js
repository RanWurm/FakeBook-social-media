const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
	content: {
		type: String,
		required: true
	}
});

const Post = new Schema({
	postID: {
		type: Number,
		default: () => Math.floor(Math.random() * 1000000),
		unique: true
	},
	authorID: {
		type: Number,
		required: true
	},
	
	picture: {
		type: String,
		required: false
	},
	content: {
		type: String,
		required: true
	},
	dateCreated: {
		type: Date,
		default: Date.now
	},
	likeCount: {
		type: Number,
		default: 0
	},
	commentSection: [ Comment ]
});

module.exports = mongoose.model('Post', Post);