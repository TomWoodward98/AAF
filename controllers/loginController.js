const db = require('../models/user');
const User = db;
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET

// Refactor into less nested IF ELSE's
// TODO - Maybe seperate into email and password IF's
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select(['+email', '+password']).exec(function(err, user) {
    let Error = {};
    if (err) {
      Error.server = 'Internal error please try again';
      res.json({Error}, 200); //500
    } else if (!user) {
      Error.email = 'This user does not exist';
      res.json({Error}, 200); //401
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          Error.server = 'Internal error please try again';
          res.json({Error}, 500);
        } else if (!same) {
          Error.email = 'Incorrect email or password';
          Error.password = 'Incorrect email or password';
          res.json({Error}, 200); //401
        } else if (!user.approved) {
          Error.approved = 'Your account has not been approved yet, please contact a site admin';
          res.json({Error}, 200); //401
        } else {
          // Session Issue token
          const payload = { user };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).status(200).json({
            Success: {
              user: user,
              jwt: token,
            }
          });
        }
      });
    }
  });
};

exports.logout = (req, res) => {
  const user = req.currentUser
  const payload = { user };
  const token = jwt.sign(payload, secret, {
    expiresIn: Date.now()
  });
  res.cookie('token', token, { httpOnly: true }).status(200).json({
    Success: {
      jwt: token,
    }
  });
};