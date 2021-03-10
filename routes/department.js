const express = require('express');
const router = express.Router();

// ---------------------- Auth middleware ----------------------\\
const withAuth = require('../middleware/auth/withAuth');
const authAdmin = require('../middleware/auth/authAdmin');
// -------------------------------------------------------------------\\

// ---------------------- Validation middleware ----------------------\\
const createDepartmentValid = require('../middleware/validation/createModel');
// -------------------------------------------------------------------\\

const DepartmentController = require('../controllers/departmentController');

router.post('/create-department', [authAdmin, createDepartmentValid], DepartmentController.create);
router.get('/get-departments', DepartmentController.get);


module.exports = router;