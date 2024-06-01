const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: { type: Number, required: true, unique: true, index: true }, // Use id as the primary identifier
    userName: { type: String, required: true },
    password: { type: String, required: true },
    nickName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    token: { type: String },
    friends: [ { type: Number, ref: 'User' } ],  
    friendRequests: [ { type: Number, ref: 'User' } ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;