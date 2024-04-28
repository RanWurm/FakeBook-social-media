const Post = require('../models/post.js');
const PostServices = require('../services/post.js');

module.exports.getPosts = async (req, res) => {
	try {
		const { author } = req.params;
		const posts = await Post.find({ author: author }).sort({ dateCreated: -1 }).limit(20);

		if (posts.length === 0) {
			return res.status(404).json({ message: "No posts found!" });
		}
		return res.json(posts);
	} catch (error) {
		res.status(500).json({ error: error.toString() });
	}
};

module.exports.createPost = async (req, res) => {
	try {
		const { authorID, author, profilePicture, content } = req.body;
		if (!author || !profilePicture || !content) {
			return res.status(400).json({ error: "Bad request, missing parameters" });
		}

		// Create a new post with the provided data
		const newPost = new Post({
			authorID,
			author,
			profilePicture,
			content
		});

		// Save the new post to the database
		const savedPost = await newPost.save();

		res.status(201).json(savedPost);
		console.log("");
	} catch (error) {
		console.error('Error creating post:', error);
		return res.status(500).json({ error: error.message });
		// return res.status(500).json({ error });
	}
};

module.exports.editPost = async (req, res) => {
	try {
		const { content, id } = req.body;
		if (!id) {
			return res.status(400).json({ error: "Bad request, missing post ID" });
		}
		const post = await Post.findById(id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (content) {
			post.content = content;
		}
		const updatedPost = await post.save();
		res.status(200).json({ message: "Post updated successfully", post: updatedPost });
	} catch (error) {
		console.error('Error editing post:', error);
		res.status(500).json({ error });
	}
};

module.exports.deletePost = async (req, res) => {
	try {
		const { author, id } = req.body;

		if (!id) {
			return res.status(400).json({ error: "Bad request, missing post ID" });
		}
		const deletedPost = await Post.findByIdAndDelete(id);
		if (!deletedPost) {
			return res.status(404).json({ error: "Post not found" });
		}

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		res.status(500).json(error);
	}
};