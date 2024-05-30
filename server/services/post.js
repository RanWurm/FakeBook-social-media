const User = require('../models/user.js');
const Post = require('../models/post.js');


module.exports.getUserPosts = async (userId) => {
    console.log("in the getUserPosts - services");
    try {
        const posts = await Post.find({ authorID: userId })
                                .sort({ dateCreated: -1 })
                                .limit(20);
        return posts;
    } catch (error) {
        console.error("Error retrieving posts:", error);
        throw error;  // Rethrow the error to be handled by the caller
    }
};

module.exports.createPost = async (authorID, picture, content) => {
    console.log("in the create post - services");
    const largestId = await Post.findOne().sort({postID: -1}).limit(1).select('postID');
	const postID = largestId ? largestId.postID + 1 : 1;
    const newPost = new Post({
         postID: postID,
         authorID: authorID, 
         picture: picture, 
         content: content 
        });
    if (!newPost) {
        throw new Error('Post was not created');
    }
    console.log(newPost);
    return await newPost.save();
};

module.exports.editPost = async (postId, updatedPost) => {
    console.log("in the edit post - services");
    const post = await Post.findOneAndUpdate({ postID: postId }, {$set: updatedPost}, {new: true});
    if (!post) {
        throw new Error('Post not found');
    }
    console.log(post);
    return await post.save();
};

module.exports.deletePost = async (postId, userId) => {
    console.log("in the delete post - services");
    const post = await Post.findOneAndDelete({ postID: postId, authorID: userId }); // Ensure the post belongs to the user
    if (!post) {
        throw new Error('Post not found or unauthorized access');
    }
    console.log(post);
    return post;
};

module.exports.getFeedPosts = async(userId) => {
    console.log("in the getFeedPosts - services");
    try {
        // Fetch the user to get their friends list
        const user = await User.findOne({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        console.log("services-> post -> line 63");
        const friendIds = user.friends;
        const friendPosts = await Post.find({ authorID: { $in: friendIds } })
                                      .sort({ dateCreated: -1 })
                                      .limit(20);

        const nonFriendPosts = await Post.find({ authorID: { $nin: friendIds } })
                                         .sort({ dateCreated: -1 })
                                         .limit(5);
        console.log("services-> post -> line 72"); 
        return friendPosts.concat(nonFriendPosts);

    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }

};