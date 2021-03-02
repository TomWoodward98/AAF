const db = require('../models/user');
const User = db;
const bcrypt = require('bcryptjs');

exports.create = (req, res) => {
  if (!req.body.email) {
    res.status(400).send({ email: "Email cannot be empty!" });
    return;
  }
  
  if (!req.body.password) {
    res.status(400).send({ password: "Password cannot be empty!" });
    return;
  }

  const { email, password } = req.body;
  const user = new User({ email, password });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(500).send("Error registering your account, try again.");
        } else {
          res.status(200).send("you have successfully registered!");
        }
      });
    });
  });
};

exports.get = (req, res) => {
  User.find()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Animals."
    });
  });
};

