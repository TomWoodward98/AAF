const express = require('express');
const router = express.Router();

// ---------------------- Auth middleware --------------------------- \\
const withAuth = require('../middleware/auth/withAuth');
// ------------------------------------------------------------------ \\

// ---------------------- Validation middleware --------------------- \\
// ------------------------------------------------------------------ \\

const ChatController = require('../controllers/chatController');
const MessageController = require('../controllers/messageController');

router.post('/create-chat', withAuth, ChatController.create)
router.get('/get-chat/:id', withAuth, ChatController.get)
router.get('/get-messages/:id', withAuth, MessageController.get);
router.post('/send-message', withAuth, MessageController.create);

module.exports = router;