const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// mongoose.Promise = global.Promise;

const fileSchema = new Schema({
    fromEmail: {
        type: String
    },
    fromName: {
        type: String
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: 'Please supply an email adress'
    },
    subject: {
        type: String,
        required: 'Please fill in a subject',
        trim: true
    },
    msg: {
        type: String,
        trim: true
    },
    filename: {
        type: String
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('File', fileSchema);