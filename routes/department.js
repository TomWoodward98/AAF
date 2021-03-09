const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/auth/withAuth');

const authAdmin = require('../middleware/auth/authAdmin');

const DepartmentController = require('../controllers/departmentController');

router.post('/create-department', authAdmin, DepartmentController.create);
router.get('/get-departments', DepartmentController.get);


module.exports = router;