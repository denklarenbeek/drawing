const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const cronJobDaySchema = new Schema({
    monday: {
        type: Boolean,
        default: true,
    },
    tuesday: {
        type: Boolean,
        default: true,
    },
    wednesday: {
        type: Boolean,
        default: true,
    },
    thursday: {
        type: Boolean,
        default: true,
    },
    friday: {
        type: Boolean,
        default: true,
    },
    saturday: {
        type: Boolean,
        default: false,
    },
    sunday: {
        type: Boolean,
        default: false,
    }
})

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
    admin: {
        type: Boolean
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    cron_jobs: {
        type: Boolean,
        default: true
    },
    cron_jobs_timer: {
        type: Number,
        default: 12096e5
    },
    cron_jobs_day: {
        type: {cronJobDaySchema}
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'}); //make sure the passportjs takes care of storing a hash of the password
userSchema.plugin(mongodbErrorHandler); //error handler for the unique field of email address

module.exports = mongoose.model('User', userSchema);