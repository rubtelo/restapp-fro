exports.validaSession = (req) => {
    // valida session activa
    if (req.session.user === undefined) {
        return false;
    } else {
        // valida duracion del token
        if (Object.keys(req.session.user).length != '0') {
            const init = req.session.user.timeSession.sessInit;
            const exp = req.session.user.timeSession.sessExp;
            return true;
        }
        else {
            return false;
        }
    }
};

exports.renderView = (req, res, view, title = 'AppX', data = undefined) => {
    res.render(view, {
        title: title,
        data: data
    });
/*     if (this.validaSession(req)) {
        res.render(view, {
            title: title,
            data: data
        });

    } else {
        console.log("sin session");
        res.redirect('/');
    } */
};