const express = require('express');
const router = express.Router();

// ---------------------- User middleware --------------------------------\\
const currentUser = require('../middleware/currentUser');
// ------------------------------------------------------------------------\\

// ---------------------- Auth middleware --------------------------------\\
const withAuth = require('../middleware/auth/withAuth');
const authAdmin = require('../middleware/auth/authAdmin');
const authSupport = require('../middleware/auth/authSupport');
const authAdminSupport = require('../middleware/auth/authAdminSupport');
// ------------------------------------------------------------------------\\

// ---------------------- Validation middleware ---------------------------\\
const loginValid = require('../middleware/validation/loginValid');
const regUserValid = require('../middleware/validation/regValid');
// ------------------------------------------------------------------------\\

const UserController = require('../controllers/userController');
const LoginController = require('../controllers/loginController');

router.post('/api/register', regUserValid, UserController.create);
router.post('/api/login', loginValid, LoginController.login);
router.post('/api/logout', withAuth,  LoginController.logout);

router.post('/api/update-user', [authAdmin, regUserValid], UserController.update); // Admin protection
router.get('/api/get-users', authAdminSupport, UserController.get); // Admin and Support
router.post('/api/delete-user', authAdmin, UserController.delete); //Admin protection

router.get('/api/get-current-user', currentUser, UserController.currentUser); //WithAuth
router.get('/api/get-user-type', UserController.userTypes);
router.post('/api/approve-user', authAdmin, UserController.approveUser); // Admin Protection

router.get('/checkToken', withAuth, function(req, res) {
    res.sendStatus(200);
});

module.exports = router;