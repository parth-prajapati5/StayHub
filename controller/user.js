const User=require('../models/user');
module.exports.renderSignUpForm=(req, res) => {
    res.render('./listings/signup.ejs');
}

module.exports.signup=async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = { username, email };
        let RegisteredUser = await User.register(newUser, password);
        console.log(RegisteredUser);
        req.login(RegisteredUser, (err) => {
            if (err) {
                next(err);
            } else {
                req.flash('success', 'Welcome to Wanderlust');
                res.redirect('/listings');
            }
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
        // res.send(e.message);
    }
}

module.exports.renderLoginForm=(req, res) => {
    res.render('./listings/login.ejs');
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.requestedUrl || '/listings');
    // res.redirect('/listings');
    // res.redirect(req.path || '/listings');
    // res.redirect(req.session.requestedUrl);
    // console.log(requestedUrl);
}

module.exports.logout= (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        } else {
            req.flash('success', 'Logged you out!');
            res.redirect('/listings');
        }
    })
}