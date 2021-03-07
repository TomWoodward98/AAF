const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/middleware')

const DepartmentController = require('../controllers/departmentController');

router.post('/create-department', withAuth, DepartmentController.create);
router.get('/get-departments', DepartmentController.get);


module.exports = router;