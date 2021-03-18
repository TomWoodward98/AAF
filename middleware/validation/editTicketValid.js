const createTicketValid = function(req, res, next) {
    let Error = {};
    
    if (!req.body.ticket) {
        Error.ticket = "You must edit a ticket!";
    }

    if ((req.body.currentUser.isAdmin) && req.body.ticket.status.name !== req.body.status.name) {
        Error.status = 'You dont have permissions to carry out this edit';
    }

    if ((req.body.currentUser.isAdmin) && req.body.ticket.info !== req.body.info) {
        Error.info = 'You dont have permissions to carry out this edit';
    }

    if (JSON.stringify(Error) !== '{}') {
        res.status(200).json({Error});
        return
    }
    next();
}
module.exports = createTicketValid;