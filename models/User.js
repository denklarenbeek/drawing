const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply an email adress'
    },
    name: {
        type: String,
        required: 'Please fill in a name',
        trim: true
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); //make sure the passportjs takes care of storing a hash of the password
userSchema.plugin(mongodbErrorHandler); //error handler for the unique field of email address

module.exports = mongoose.model('User', userSchema);