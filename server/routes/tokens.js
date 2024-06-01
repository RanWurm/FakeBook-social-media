const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');
console.log("tokens.js routes");
//login the user and provide with token
router.route('/').post(userController.login);

module.exports = router;