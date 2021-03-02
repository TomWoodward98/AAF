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

    const created_by = funct.user._id;
    const { info, title, allocatedTo } = req.body;

    const allocated_to = allocatedTo ? allocatedTo._id : null;

    const ticket = new Ticket({ title, info, allocated_to, created_by });

    ticket.save(function(err) {
        if (err) {
            console.log(err);
            console.log(ticket);
            res.status(500).send("Error creating your ticket, try again.");
        } else {
            res.send(ticket, 200);
        }
    });
};

exports.get = (req, res) => {
    console.log('Hallo');
    Ticket.find().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
        message:err.message || "Some error occurred while retrieving Tickets."
    });
  });
};