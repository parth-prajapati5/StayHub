const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');
const { isRedirectedUrl } = require('../middleware.js');
const userConstroller=require('../controller/user.js');
// const passport=require('passport');
// const Localstrategy=require('passport-local');

// //passport configuration
// router.use(passport.initialize());
// router.use(passport.session());
// passport.use(new Localstrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


router.route('/signup')
.get(userConstroller.renderSignUpForm)
.post( WrapAsync(userConstroller.signup));
// router.get('/signup', userConstroller.renderSignUpForm);

// router.post('/signup', WrapAsync(userConstroller.signup));


router.route('/login')
.get(userConstroller.renderLoginForm)
.post(isRedirectedUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), WrapAsync(userConstroller.login));
// router.get('/login', userConstroller.renderLoginForm);


// router.post('/login', isRedirectedUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), WrapAsync(userConstroller.login));


router.get('/logout',userConstroller.logout);


module.exports = router;