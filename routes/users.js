const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/middleware')
const currentUser = require('../middleware/currentUser')

const UserController = require('../controllers/userController');
const LoginController = require('../controllers/loginController');

router.post('/api/register', UserController.create);
router.post('/api/login',  LoginController.login);

router.post('/api/update-user', withAuth, UserController.update);
router.get('/api/getUsers', withAuth, UserController.get);
router.get('/api/get-current-user', currentUser, UserController.currentUser);
router.get('/api/get-user-type', UserController.userTypes);
router.post('/api/approve-user', withAuth, UserController.approveUser);

router.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});

module.exports = router;