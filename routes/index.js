const express = require('express');
const router = express.Router();

// Require controller modules.
var userController = require('../controllers/userController');

/* GET home page. */
// router.get('/', function(req, res) {
//   res.send('it works');
// });
let userSchema = require('../models/user');

// router.post('/create-user', userController.create);

router.route('/create-user').post((req, res, next) => {
    console.log('hit 1');
    userSchema.create(req.body, (error, data) => {
        if (error) {
            console.log('hit 2');
            return next(error)
        } else {
            console.log('hit 3', data)
            res.json(data)
        }
    })
});

module.exports = router;