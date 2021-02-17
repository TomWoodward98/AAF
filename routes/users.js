const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const LoginController = require('../controllers/loginController');

router.post('/api/register', UserController.create);
router.post('/api/login',  LoginController.login);

module.exports = router;