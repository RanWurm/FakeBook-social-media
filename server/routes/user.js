const express = require('express');
var router = express.Router();
const userController = require('../controllers/user.js');

router.route('/').post(userController.createUser);
