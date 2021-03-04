const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/middleware')
const getStatuses = require('../middleware/statuses')

const TicketController = require('../controllers/ticketController');
const ColumnController = require('../controllers/columnController');

router.post('/create-ticket', [withAuth, getStatuses], TicketController.create);
router.get('/get-tickets', withAuth, TicketController.get);
router.post('/create-column', withAuth, ColumnController.create);
router.get('/get-columns', withAuth, ColumnController.get);


module.exports = router;