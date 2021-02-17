const db = require('../models/user');
const User = db;

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, function(err, user) {
    if (err) {
      console.error(err);
      res.json({
        Error: [
          { server: 'Internal error please try again' }
        ]
      }, 200); //500
    } else if (!user) {
      res.json({
        Error: [
          { email: 'This user does not exist' }
        ]
      }, 200); //401
    } else {
      user.isCorrectPassword(password, function(err, same) {
        if (err) {
          res.status(500)
            .json({
            Error: 'Internal error please try again'
          });
        } else if (!same) {
          res.status(200) //401
            .json({
            Error: [
              { email: 'Incorrect email or password'},
              { password: 'Incorrect email or password wrong tbh'}
            ]
          });
        } else {
            // Session redirect etc
        }
      });
    }
  });
};