const db = require('../models/ticket');
const Ticket = db;
const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;

const secret = process.env.SECRET

exports.create = (req, res) => {

    const created_by = req.user._id;
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
    
    const department = req.body.raisedBy.department._id;

    const ticket = new Ticket({ title, info, allocated_to, created_by, raised_by, status, department });
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
                created_by: req.user,
                raised_by: req.body.raisedBy,
                status: statusDoc,
                chat: null,
                department: department,
                created_at: ticket.created_at,
            }
            res.status(200).send(newTicket);
        }
    });
};

exports.get = (req, res) => {
    if (req.user.user_type.type === 'client') {
        Ticket.find({'raised_by': req.user._id}).populate(['created_by', 'allocated_to', 'raised_by', 'status', 'chat', 'department']).exec(function (err, data) {
            if (err) {
                res.status(500).send({
                    message:err.message || "Some error occurred while retrieving Tickets."
                });
            }
            res.status(200).send(data);
        });
    } else {
        Ticket.find().populate(['created_by', 'allocated_to', 'raised_by', 'status', 'chat', 'department']).exec(function (err, data) {
            if (err) {
                res.status(500).send({
                    message:err.message || "Some error occurred while retrieving Tickets."
                });
            }
            res.status(200).send(data);
        });
    }
};

exports.update = (req, res) => {
    const ticket = req.body.ticket;

    const id = ticket._id;
    const title = req.body.title ? req.body.title :  ticket.title;
    const info = req.body.info ? req.body.info :  ticket.info;
    const status = req.body.status ? req.body.status._id :  ticket.status._id;
    const allocated_to = req.body.allocatedTo ? req.body.allocatedTo._id : ticket.allocated_to;
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
                    _id: id,
                    title: title,
                    department: doc.department,
                    info: info,
                    allocated_to: req.body.allocatedTo ? req.body.allocatedTo : ticket.allocated_to,
                    created_by: ticket.created_by,
                    raised_by: ticket.raised_by,
                    status: req.body.status ? req.body.status : ticket.status,
                    created_at: ticket.created_at,
                    chat: doc.chat
                }
                res.status(200).send(updatedTicket);            
            }
        }
    );  
};
