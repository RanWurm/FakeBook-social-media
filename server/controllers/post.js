const Post = require('../models/post.js');
const postServices = require('../services/post.js');
const userServices = require('../services/user.js'); 


module.exports.getFeedPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user's ID is stored in `req.user` by the `authenticate` middleware

        const posts = await postServices.getFeedPosts(userId);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error getting posts:', error.message);
        res.status(500).json({ error: error.message });
    }
};

module.exports.getUserPosts = async (req, res) => {
    try {
        const userId = req.params.id;
        const requestorId = req.user.id;

        // Verify if the requestor is a friend of the user whose posts are being requested
        const isFriend = await userServices.areFriends(userId, requestorId);
        if (!isFriend) {
            return res.status(403).json({ message: "Access denied: Requestor is not a friend of the user." });
        }

        // Retrieve the posts using the service
        const posts = await postServices.getPosts(userId);
        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found for the user." });
        }
        return res.json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports.createPost = async (req, res) => {
    const userIdFromParams = req.params.id;
    const { picture, content } = req.body;

    if (!picture || !content) {
        return res.status(400).json({ error: "Bad request, missing parameters" });
    }

    if (req.user.id !== userIdFromParams) {
        return res.status(403).json({ error: "Unauthorized to create post for another user" });
    }

    try {
        const savedPost = await postServices.createPost(req.user.id, picture, content);
        res.status(201).json(savedPost);
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: error.message });
    }
};

module.exports.editPost = async (req, res) => {
    const requesterId = req.params.id; // User ID from the URL parameters
    const postId = req.params.pid; // Post ID from the URL parameters
    const userId = req.user.id; // Authenticated user's ID from JWT
    const { picture, content } = req.body; // Content to update from the request body

    if (!content || !picture) {
        return res.status(400).json({ error: "Bad request, missing content or picture" });
    }

    // First, verify that the requester is the user
    if (!userServices.verifyUser(requesterId, userId)) {
        return res.status(403).json({ error: "Unauthorized to edit this post" });
    }

    try {
        // Now, attempt to edit the post if the user verification is successful
        const updatedPost = await postServices.editPost(postId, userId, picture, content);
        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (error) {
        console.error('Error editing post:', error.message);
        if (error.message === 'Post not found') {
            res.status(404).json({ error: "Post not found" });
        } else if (error.message.includes('Unauthorized access')) {
            res.status(403).json({ error: "Unauthorized to edit this post" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports.deletePost = async (req, res) => {
	const requesterId = req.params.id; // User ID from the URL parameters
    const postId = req.params.pid; // Post ID from the URL parameters
    const userId = req.user.id; // Authenticated user's ID from JWT

    if (!userServices.verifyUser(requesterId, userId)) {
        return res.status(403).json({ error: "Unauthorized to delete this post" });
    }

    try {
        // Attempt to delete the post
        const deletedPost = await postServices.deletePost(postId, userId);
        res.status(200).json({ message: "Post deleted successfully", post: deletedPost });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        if (error.message.includes('Post not found') || error.message.includes('unauthorized access')) {
            res.status(404).json({ error: "Post not found or unauthorized access" });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};