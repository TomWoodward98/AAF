const db = require('../models/user');
const dbType = require('../models/userType');
const User = db;
const UserType = dbType;
const bcrypt = require('bcryptjs');

exports.create = (req, res) => {
  if (!req.body.title) {
    res.status(200).send({ errors: [{ title: "Title cannot be empty!" }]});
    return;
  }
  if (!req.body.first_name) {
    res.status(200).send({ errors: [{ first_name: "First name cannot be empty!" }]});
    return;
  }
  if (!req.body.last_name) {
    res.status(200).send({ errors: [{ last_name: "Last name cannot be empty!" }]});
    return;
  }
  if (!req.body.email) {
    res.status(200).send({ errors: [{ email: "Email cannot be empty!" }]});
    return;
  }
  
  if (!req.body.password) {
    res.status(200).send({ errors: [{ password: "Password cannot be empty!" }]});
    return;
  }

  if (!req.body.department) {
    res.status(200).send({ errors: [{ department: "Department cannot be empty!" }]});
    return;
  }
  if (!req.body.user_type) {
    res.status(200).send({ errors: [{ user_type: "Permisson type cannot be empty!" }]});
    return;
  }

  const department = req.body.department._id
  const user_type = req.body.user_type._id
  const { title, first_name, last_name, email, password } = req.body;
  const user = new User({ title, first_name, last_name, email, password, department, user_type });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.save(function(err) {
        if (err) {
          console.log(err);
          res.status(500).send("Error creating your user, try again.");
        } else {
          res.send(user, 200);
        }
      });
    });
  });
};

exports.get = (req, res) => {
  User.find().populate(['department', 'user_type']).exec(function (err, data) {
    if (err) {
        res.status(500).send({
            message:err.message || "Some error occurred while retrieving Tickets."
        });
    }
    res.send(data);
  });
};

exports.userTypes = (req, res) => {
  UserType.find().then(data => {
    console.log('Types: ', data);
    res.send(data);
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving User Types."
    });
  });
};

