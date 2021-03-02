const express = require('express');
const router = express.Router();
const withAuth = require('../middleware/middleware')

const TicketController = require('../controllers/ticketController');

router.post('/create-ticket', withAuth, TicketController.create);
router.get('/get-tickets', withAuth, TicketController.get);


module.exports = router;