const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/middleware')

const UserController = require('../controllers/userController');
const LoginController = require('../controllers/loginController');

router.post('/api/register', UserController.create);
router.post('/api/login',  LoginController.login);

router.get('/api/getUsers', UserController.get);

router.get('/checkToken', withAuth);

module.exports = router;