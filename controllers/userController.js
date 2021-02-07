const db = require('../models/user');
const User = db;

exports.create = (req, res) => {
    // Validate request
  if (!req.body.name) {
    res.status(400).send({ name: "Name can not be empty!" });
    return;
  }
  
  if (!req.body.password) {
    res.status(400).send({ password: "Password can not be empty!" });
    return;
  }

  // Create a User model object
  const user = new User({
    name: req.body.name,
    password: req.body.password
  });

  // Save User in the database
  user.save().then(data => {
      console.log("User saved in the database: " + data);
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
  });

};