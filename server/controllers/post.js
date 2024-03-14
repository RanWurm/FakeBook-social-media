const Post = require('../models/post.js');
const PostServices = require('../services/post.js');

export const getPosts = async (req, res) => {
	try {
	  const userId = req.params.userId; // Assuming userId is passed as a URL parameter
	  const posts = await Post.find({ author: userId }).sort({ dateCreated: -1 }).limit(20);
		
	  if(!posts){
			return res.status(404).send({message:"No posts found!"});
		}
	  return res.json(posts);
	} catch (error) {
	  res.status(500).send(error.toString());
	}
	
  };
const editPost = 0;
const deletePost = 0;