const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    sent_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
}, {
    collection: 'messages'
});

module.exports = mongoose.model('Message', messageSchema)