module.exports = () => {
    return function (req, res, next) {
        if (!req.session.user) {
            console.log("no active session");
            delete req.session.user;
            delete req.session.token;
            return res.redirect('/');
        }
        next();
    }
};
