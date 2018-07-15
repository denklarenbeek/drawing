const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    prices: {
        type: Array
    }
});

module.exports = mongoose.model('Product', productSchema);