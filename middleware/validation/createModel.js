const createModel = function(req, res, next) {
    let Error = {};
    
    if (!req.body.name) {
        Error.name = "Name cannot be empty!";
    }

    if (JSON.stringify(Error) !== '{}') {
        res.status(200).json({Error});
        return
    }
    next();
}
module.exports = createModel;