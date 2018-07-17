const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const debitorschema = new Schema({
    name: {
        type: String,
        trim: true
    },
    signer: String,
    kvk: String,
    street: String,
    zippcode: String,
    city: String
});

const locationSchema = new Schema({
    number: String,
    name: {
        type: String,
        trim: true
    },
    hardware: Boolean,
    fee: Number,
    street: String,
    zippcode: String,
    city: String
})

const pcfContractSchema = new Schema({
    debitor: [debitorschema],
    starting_date: Date,
    duration: String,
    stepout: Boolean,
    locations: [locationSchema],
    total_value: Number,
    generated_on: {
        type: Date,
        default: Date.now
    },
    send_by_email: Boolean,
    send_on: Date,
    signed: Boolean,
    signed_on: Date,
    document_url: String,
    sales_rep: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
});

pcfContractSchema.pre('save', function(next){
    if(this.send_by_email){
        this.send_on = Date.now();
    };
    next();
});

module.exports = mongoose.model('pcfContract', pcfContractSchema);