const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let chatSchema = new Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
}, {
    collection: 'chats'
});

module.exports = mongoose.model('Chat', chatSchema)