const db = require('../models/ticket');
const Ticket = db;
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET

exports.create = (req, res) => {
    const token = req.cookies.token;
    const funct = jwt.verify(token, secret);

    if (!req.body.title) {
        res.status(400).send({ title: "Title cannot be empty!" });
        return;
    }
  
    if (!req.body.info) {
        res.status(400).send({ info: "The ticket description cannot be empty!" });
        return;
    }

    if (!req.body.raisedBy) {
        res.status(400).send({ info: "The ticket has to be raised by someone!" });
        return;
    }

    const created_by = funct.user._id;
    const { info, title, allocatedTo, raisedBy } = req.body;

    const allocated_to = allocatedTo ? allocatedTo._id : null;
    const raised_by = raisedBy._id;

    const ticket = new Ticket({ title, info, allocated_to, created_by, raised_by });
    
    ticket.save(function(err) {
        if (err) {
            console.log(err);
            res.status(500).send("Error creating your ticket, try again.");
        } else {
            const newTicket = 
            {
                _id: ticket._id,
                title: ticket.title,
                info: ticket.info,
                allocated_to: req.body.allocatedTo,
                created_by: funct.user,
                raised_by: req.body.raisedBy,
                created_at: ticket.created_at,
            }
            res.send(newTicket, 200);
        }
    });
};

exports.get = (req, res) => {
    Ticket.find().populate(['created_by', 'allocated_to', 'raised_by']).exec(function (err, data) {
        if (err) {
            res.status(500).send({
                message:err.message || "Some error occurred while retrieving Tickets."
            });
        }
        res.send(data);
    });
};
