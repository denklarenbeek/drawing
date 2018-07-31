const mongoose = require('mongoose');
const Opportunity = require('../models/Opportunity');

exports.createOpportunity = async (req, res) => {
    console.log(req.body);
    const opportunity = new Opportunity({
        account_name: req.body.account_name,
        account_id: req.body.account_id,
        name: req.body.name,
        amount: req.body.amount,
        timing: req.body.timing,
        scotsman: req.body.scotsman,
        status: req.body.status,
        order_received: false,
        deleted_opportunity: false,
        sales_rep: req.body.sales_rep
    });

    await opportunity.save((err, file, rows) => {
        if(err) console.log(err);
        if(!err) console.log('Hi added to the db');
    });
    req.flash('success', 'Your opportunity has been saved!');
    res.json({msg: 'added!'});
};

exports.getAllOpportunities = async (req, res) => {
    const opportunities = await Opportunity.find({sales_rep: req.user._id});
    console.log(opportunities)
    res.render('opportunities', {opportunities});
};