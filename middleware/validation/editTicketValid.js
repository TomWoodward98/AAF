const createTicketValid = function(req, res, next) {
    let Error = {};
    
    if (!req.body.ticket) {
        Error.ticket = "You must edit a ticket!";
    }

    if (JSON.stringify(Error) !== '{}') {
        res.status(200).json({Error});
        return
    }
    next();
}
module.exports = createTicketValid;