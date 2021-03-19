const createTicketValid = function(req, res, next) {
    let Error = {}
    if (!req.body.title) {
        Error.title = "Title cannot be empty!";
    }
  
    if (!req.body.info) {
        Error.info = "The ticket description cannot be empty!";
    }

    if (!req.body.raisedBy) {
        Error.raisedBy = "The ticket has to be raised by someone!";
    }

    if (JSON.stringify(Error) !== '{}') {
        res.status(200).json({Error});
        return
    }
    next();
}
module.exports = createTicketValid;