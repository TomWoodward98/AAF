const express = require('express');
const router = express.Router();

// ---------------------- Auth middleware ---------------------------\\
const withAuth = require('../middleware/auth/withAuth');
const authAdmin = require('../middleware/auth/authAdmin');
const authSupport = require('../middleware/auth/authSupport');
const authClient = require('../middleware/auth/authClient');
const authSupportClient = require('../middleware/auth/authSupportClient');
// ------------------------------------------------------------------\\

// ---------------------- Validation middleware ----------------------\\
const createTicketValid = require('../middleware/validation/createTicketValid');
const editTicketValid = require('../middleware/validation/editTicketValid');
const createColumnValid = require('../middleware/validation/createModel');
// -------------------------------------------------------------------\\

const currentUser = require('../middleware/currentUser');
const getStatuses = require('../middleware/statuses');

const TicketController = require('../controllers/ticketController');
const ColumnController = require('../controllers/columnController');

router.post('/create-ticket', [authSupportClient, getStatuses, createTicketValid], TicketController.create);

router.get('/get-tickets', currentUser, TicketController.get);

router.post('/update-ticket', [withAuth, getStatuses, editTicketValid], TicketController.update);

router.post('/create-column', [authAdmin, createColumnValid], ColumnController.create);
router.get('/get-columns', withAuth, ColumnController.get);


module.exports = router;