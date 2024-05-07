const User = require('../models/user.js');
const Post = require('../models/post.js');


module.exports.getUserPosts = async (userId) => {
    try {
        const posts = await Post.find({ author: userId })
                                .sort({ dateCreated: -1 })
                                .limit(20);
        return posts;
    } catch (error) {
        console.error("Error retrieving posts:", error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

module.exports.createPost = async (authorID, picture, content) => {
    const newPost = new Post({ authorID, picture, content });
    return await newPost.save();
};

const editPost = async (postId, userId, newPicture, newContent) => {
    const post = await Post.findById(postId);
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.authorID.toString() !== userId) {
        throw new Error('Unauthorized access');
    }
    post.content = newContent;
    post.picture = newPicture;
    return await post.save();
};

module.exports.deletePost = async (postId, userId) => {
    const post = await Post.findOne({ postID: postId, authorID: userId }); // Ensure the post belongs to the user
    if (!post) {
        throw new Error('Post not found or unauthorized access');
    }
    await post.remove();
    return post;
};

module.exports.getFeedPosts = async(userId) => {
    try {
        // Fetch the user to get their friends list
        const user = await User.findById(userId).populate('friends');
        if (!user) {
            throw new Error('User not found');
        }

        const friendIds = user.friends.map(friend => friend.id);
        const friendPosts = await Post.find({ authorID: { $in: friendIds } })
                                      .sort({ dateCreated: -1 })
                                      .limit(20);

        const nonFriendPosts = await Post.find({ authorID: { $nin: friendIds } })
                                         .sort({ dateCreated: -1 })
                                         .limit(5);

        return friendPosts.concat(nonFriendPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};



