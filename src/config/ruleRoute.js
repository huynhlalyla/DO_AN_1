module.exports = {
    userRule: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/auth');
        }
    },
    adminRule: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            next();
        } else {
            res.redirect('/auth');
        }
    }
}