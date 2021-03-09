const jwt = require('jsonwebtoken');
const db = require('../../models/user');
const User = db;

const secret = process.env.SECRET
const authAdmin = function(req, res, next) {
    const token =
        req.body.token ||
        req.query.token ||
        req.headers['x-access-token'] ||
        req.cookies.token
    ;
    
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
    } else {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                res.status(401).send('Unauthorized: Invalid token');
            } else {
                User.findOne({ 'email': decoded.user.email })
                .populate(['department', 'user_type']).exec(function(err, user) {
                    if (err) {
                        throw err;
                    } else if (user.user_type.type === 'admin' || user.user_type.type === 'support') {
                        req.user = user;
                        next();
                    } else {
                        res.status(401).send('Unauthorized: Invalid Permissions');
                    }
                });
            }
        });
    }
}
module.exports = authAdmin;