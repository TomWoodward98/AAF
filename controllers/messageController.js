const db = require('../models/message');
const Message = db;

exports.create = (req, res) => {
    const { sent_by, chat } = req.body;
    const content = req.body.newMessage;
    const message = new Message({ content, sent_by, chat });
    
    message.save(function(err) {
        if (err) {
            res.status(500).send("Error sending your message, try again.");
        } else {
            res.status(200).send(message);
        }
    });
};

exports.get = (req, res) => {
    Message.find({'chat': req.params.id}).then(data => {
        res.status(200).send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving Messages."
        });
    });
};