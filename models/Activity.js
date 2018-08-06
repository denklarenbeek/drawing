const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const ActivitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        required: 'Please provide a category of th activity'
    },
    type: {
        type: String
    },
    sales_rep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Please login before saving new opportunities'
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);