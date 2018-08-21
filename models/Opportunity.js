'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const opportunitySchema = new Schema({
    account_name: {
        type: String,
        trim: true,
        required: 'Please fill in the name of the account',
        index: true
    },
    name: {
        type: String,
        trim: true,
        required: 'Please fill in de name of the opportunity'
    },
    amount: {
        type: Number,
        required: 'Please fill in the sum of the opportunity '
    },
    scotsman: {
        type: Number,
        required: 'Please fill in the probabilty of getting this order'
    },
    weighted_amount: {
        type: Number,
        required: 'Please add weighted amount'
    },
    timing: {
        type: Date,
        required: 'Please fill in when you expect to get the order'
    },
    status: {
        type: String,
        required: 'Please fill in what the status if of the opportunity'
    },
    order_received: {
        type: Boolean,
        required: 'Please fill in if you already got the order'
    },
    category: {
        type: String,
        required: 'Please provide a category'
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Opportunity'
    },
    original_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
        default: this._id
    },
    deleted_opportunity: {
        type: Boolean,
        required: 'Please fill in if the opportunity is cancelled'
    },
    created_on: {
        type: Date,
        default: Date.now
    },
    sales_rep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'Please login before saving new opportunities'
    }
}, { autoIndex: false });

opportunitySchema.index({
    account_name: 'text',
    name: 'text'
});

opportunitySchema.pre('save', function(next){
    if(!this.original_id){
        this.original_id = this._id;
    }
    next();
})

opportunitySchema.statics.getOpportunitiesByCustomer = function(user){
    return this.aggregate(
        [
        { $match : { deleted_opportunity: false, sales_rep: user } },
        { 
            $group : { 
                _id : "$account_name",
                count: { $sum: 1 }, 
                opp: { 
                    $push: "$$ROOT" 
                } 
            }    
        }, {$sort: { _id: 1}}
    ])
};

module.exports = mongoose.model('Opportunity', opportunitySchema);