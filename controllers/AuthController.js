const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const promisify = require('es6-promisify');
const mail = require('../handlers/mailer');

exports.register = async (req, res, next) => {
    if(req.body.admin){
        req.body.admin = true;
    } else {
        req.body.admin = false;
    };
    const user = new User({ email: req.body.email, name: req.body.name, admin: req.body.admin});
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    res.redirect('/');
};

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed login',
    successRedirect: '/',
    successFlash: 'You\'re logged in'
});

exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'You are logged out!')
    res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
        return
    }
    console.log();
    req.flash('error', 'Ooops you must be logged in to do that!')
    res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
        return
    }
    req.flash('error', 'Ooops you must be an admin to do that')
    res.redirect('/');
}

exports.forgot = async (req, res) => {
    // 1. See if the user exists in the database
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'There is no user with this email address');
    }
    // 2. Set a reset token and the expiry date of the account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save() // save the new two fields to the account

    // 3. Send them an email with reset token
    const resetUrl = `${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password reset',
        resetUrl,
        filename: 'password-reset'
    });

    req.flash('success', `The password reset link has been send to your email`);
    // 4. log the user in
    res.redirect('/login');
};

exports.reset = async (req, res) => {
    const user = await User.findOne({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    });
    if(!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }

    res.render('reset', {title: 'Reset your password', user});
};

exports.confirmedPasswords = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']){
        next();
        return;
    }
    req.flash('error', 'Passwords do not match');
    res.redirect('back');
};

exports.updatePassword = async (req, res) => {
   const user = await User.findOne({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() } 
    });
    if(!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user); 
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Your password is reset');
    res.redirect('/');
};