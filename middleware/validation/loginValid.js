const loginValid = function(req, res, next) {
    let Error = {}
    if (!req.body.email) {
        Error.email = "Please enter your email";
    }
    
    if (!req.body.password) {       
        Error.password = "Please enter your password";
    } 
    
    if (JSON.stringify(Error) !== '{}') {
        res.status(200).json({Error});
        return
    }
    next();
}
module.exports = loginValid;