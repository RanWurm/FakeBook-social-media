const { User, FriendRequest } = require('../models/user');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.js');
const key = "133221333123111";
const postController = require('../controllers/post.js');
const { ObjectId } = require('mongoose').Types;

function tokenIsValid (token) {
	try {
		const dec = jwt.verify(token, key);
		if (dec !== undefined) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
}

class userController {

async createUser(req, res) {
	try {
		console.log(req.body);
		const { userName, password, nickName, profilePicture } = req.body;

		// Check if the username already exists
		const existingUser = await User.findOne({ userName });
		if (existingUser) {
			return res.status(409).json({ error: 'Username is already taken' });
		}
		const newUser = await userService.createUser(userName, password, nickName, profilePicture);
		res.status(201).json(newUser);
	} catch (error) {
		console.error('Failed to register:', error);
		res.status(500).json({ error });
	}
}

async login (req, res) {
	try {
		const userName = req.body.userName;
  		const password = req.body.password;
		const user = await userService.login(userName, password);
		if (!user) {
			return res.status(404).json({ error: "Invalid username or password" });
		}
		res.status(200).json({ user });
		
	} catch (error) {
		res.status(500).json({ error: "Something went wrong!" });
	}
}

async getUserById (req, res) {
    const userId = req.params.id; // the ID from the URL
    const requesterId = req.user.id; // the ID of the authenticated user, set by the authenticate middleware

    try {
        // Find the target user by ID
        const targetUser = await User.findById(userId).populate('friends', 'id'); // Populate only the id of friends

        // Check if the target user was found
        if (!targetUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the target user is in the requester's friends list
        const isFriend = targetUser.friends.some(friend => friend._id.equals(requesterId));

        if (!isFriend) {
            return res.status(403).json({ error: "Access denied: user is not a friend" });
        }

        // Send the user details if everything is okay
        const { userName, nickName, profilePicture, id } = targetUser;
        res.status(200).json({ userName, nickName, profilePicture, id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

async deleteUserById(req, res) {
    try {
        const userIdToDelete = req.params.id;  // Get the user ID from URL parameters

        // Authorization check: Ensure the logged-in user's ID matches the ID in the request
        if (req.user.id !== userIdToDelete) {
            return res.status(403).json({ error: "Unauthorized to delete this profile" });
        }

        // Call the service function to delete the user
        const deletedUser = await userService.deleteUserById(userIdToDelete);

        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully", userId: userIdToDelete });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async getFriendsList (req, res) {
	const userId = req.params.id;
    const requestorId = req.user.id;

	const isFriend = await userService.areFriends(userId, requestorId);
	const userItself = userService.verifyUser(userId, requestorId);

	if (!isFriend && !userItself) {
		return res.status(403).json({ message: "Access denied: Requestor is not a friend of the user or the user itself." });
	}
	try {
		const friendsList = await userService.getFriendsList(id);
		res.status(200).json(friendsList);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}



async getPosts (req, res) {
	try {
		res.json('get user post ');
	} catch (error) {
		res.json('Error');
	}
}

async editUserById(req, res) {
    try {
        const userId = req.params.id;  // User ID from the URL parameters
        const { nickName, profilePicture } = req.body;  // Directly extract expected fields

        // Check if the necessary fields are present
        if (!nickName || !profilePicture) {
            return res.status(400).json({ error: "Bad request, missing nickName or profilePicture" });
        }

        // Authorization check: Ensure the logged-in user's ID matches the ID in the request
        if (req.user.id !== userId) {
            return res.status(403).json({ error: "Unauthorized to edit this profile" });
        }

        // Prepare the data for updating
        const newData = { nickName, profilePicture };

        // Call the service function to edit the user
        const updatedUser = await userService.editUserById(userId, newData);

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error('Error editing user:', error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


async sendFriendRequest(req, res) {
    try {
        const userId = req.params.id;
        const requestorId = req.user.id;
        
        await userService.sendFriendRequest(requestorId, userId);

        res.status(200).json({ message: 'Request sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });  // It's good to specify an HTTP status code for errors.
    }
}


async approveFriendRequest(req, res) {
    try {
        const userId = req.params.id;
        const approvedId = req.params.fid;
        const tokenId = req.user.id;

        // Check if the authenticated user is the recipient of the friend request
        if (userId !== tokenId) {
            return res.status(403).json({ error: 'Unauthorized to approve this request' });
        }

        // Call userService to handle the approval logic
        await userService.approveFriendRequest(approvedId, userId);

        return res.status(200).json({ message: 'Friend request approved successfully' });
    } catch (error) {
        console.error('Error approving friend request:', error);
        return res.status(400).json({ error: error.message });
    }
}



async deleteFriend (req, res) {
	try {
		const userId = req.params.id;
        const friendToDelete = req.params.fid;
        const tokenId = req.user.id;

		if (userId !== tokenId) {
            return res.status(403).json({ error: 'Unauthorized to approve this request' });
        }
		await userService.deleteFriend(userId, friendToDelete);
		return res.status(200).json({ message: 'Friend deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend:', error);
        return res.status(400).json({ error: error.message });
    }
}
}
module.exports = userController;