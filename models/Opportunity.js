const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const opportunitySchema = new Schema({
    account_name: {
        type: String,
        required: 'Please fill in the name of the account'
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
    parent_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Opportunity'
    },
    deleted_opportunity: {
        type: Boolean,
        required: 'Please fill in if the opportunity is cancelled'
    },
    sales_rep: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

opportunitySchema.statics.getOpportunitiesByCustomer = function(){
    return this.aggregate(
        [
        { $match : { deleted_opportunity: false } },
        { 
            $group : { 
                _id : "$account_name",
                count: { $sum: 1 }, 
                opp: { 
                    $push: "$$ROOT" 
                } 
            },   
        }, 
        { $sort : { account_name : 1 } }]
     )
};

module.exports = mongoose.model('Opportunity', opportunitySchema);