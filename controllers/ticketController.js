const db = require('../models/ticket');
const Ticket = db;
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
const user = require('../models/user');

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

    const statuses = req.status
    let statusDoc;
    for (i = 0; i < statuses.length; i++) {
        if (statuses[i].name === "Open") {
            statusDoc = statuses[i];
        }
    }
    
    const status = statusDoc._id;

    const ticket = new Ticket({ title, info, allocated_to, created_by, raised_by, status });
    ticket.save(function(err) {
        if (err) {
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
                status: statusDoc,
                created_at: ticket.created_at,
            }
            res.send(newTicket, 200);
        }
    });
};

exports.get = (req, res) => {
    if (req.user.user_type.type === 'client') {
        Ticket.find({'raised_by': req.user._id}).populate(['created_by', 'allocated_to', 'raised_by', 'status']).exec(function (err, data) {
            if (err) {
                res.status(500).send({
                    message:err.message || "Some error occurred while retrieving Tickets."
                });
            }
            res.send(data);
        });
    } else {
        Ticket.find().populate(['created_by', 'allocated_to', 'raised_by', 'status']).exec(function (err, data) {
            if (err) {
                res.status(500).send({
                    message:err.message || "Some error occurred while retrieving Tickets."
                });
            }
            res.send(data);
        });
    }
};

exports.update = (req, res) => {
    if (!req.body.title) {
        res.status(400).send({ title: "Title cannot be empty!" });
        return;
    }
  
    if (!req.body.info) {
        res.status(400).send({ info: "The ticket description cannot be empty!" });
        return;
    }

    if (!req.body.status) {
        res.status(400).send({ info: "The ticket has to have a status!" });
        return;
    }

    const ticket = req.body.ticket;
    const { info, title, allocatedTo } = req.body;
    const id = ticket._id;
    const allocated_to = allocatedTo ? allocatedTo._id : null;
    const status = req.body.status._id;
    Ticket.findByIdAndUpdate(
        ObjectID(id), 
        {
            $set: {title: title, info: info, allocated_to: allocated_to, status: status},
        }, 
        function(err, doc) {
            if (err) {
                res.status(500).send("Error editting your ticket, try again.");
            } else {
                const updatedTicket = 
                {
                    _id: ticket._id,
                    title: title,
                    info: info,
                    allocated_to: allocatedTo,
                    created_by: ticket.created_by,
                    raised_by: ticket.raised_by,
                    status: req.body.status,
                    created_at: ticket.created_at,
                }
                res.status(200).send(updatedTicket);            
            }
        }
    );  
};
