const db = require('../models/chat');
const Chat = db;
const dbTicket = require('../models/ticket');
const Ticket = dbTicket;
const ObjectID = require('mongodb').ObjectID;

exports.create = (req, res) => {
    const { ticket } = req.body;
    const chat = new Chat({ ticket });

    chat.save(function(err, doc) {
        if (err) {
            res.status(500).send("Error creating a chat, try again.");
        } else {
            Ticket.findByIdAndUpdate(
                ObjectID(ticket), 
                {
                    $set: {chat: doc._id},
                }, function(err, ticket) {
                    if (err) {
                        res.status(500).json("Error editting this ticket, try again.") //500
                    } else {
                        res.status(200).json(doc);
                    }
                }
            );
        }
    });
};

exports.get = (req, res) => {
    Chat.findOne({'ticket': ObjectID(req.params.id) }).then( function (data) {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
    });
};