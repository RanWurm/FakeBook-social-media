const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	content: {
		type: String,
		required: true
	}
});

const postSchema = new Schema({
	postID: {
		type: Number,
		required: true,
		unique: true, 
		index: true
	},
	authorID: {
		type: Number,
		required: true
	},
	
	picture: {
		type: String,
		required: true
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
	comments: [ commentSchema ]
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;