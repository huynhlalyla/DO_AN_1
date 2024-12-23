module.exports = (req, res, next) => {
    if(req.session && req.session.user) {
        res.locals.user = req.session.user;
    }
    if(req.session && req.session.admin) {
        res.locals.admin = req.session.admin;
    }
    next();
}