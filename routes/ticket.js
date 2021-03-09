const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/auth/withAuth');
const getStatuses = require('../middleware/statuses');

const authAdmin = require('../middleware/auth/authAdmin');
const authSupport = require('../middleware/auth/authSupport');
const currentUser = require('../middleware/currentUser');

const TicketController = require('../controllers/ticketController');
const ColumnController = require('../controllers/columnController');

router.post('/create-ticket', [withAuth, getStatuses], TicketController.create);

router.get('/get-tickets', currentUser, TicketController.get);

router.post('/update-ticket', [withAuth, getStatuses], TicketController.update);

router.post('/create-column', authAdmin, ColumnController.create);
router.get('/get-columns', withAuth, ColumnController.get);


module.exports = router;