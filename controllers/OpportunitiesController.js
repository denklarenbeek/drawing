'use strict';

const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");
const {createActivity} = require('../handlers/activityLogger');

exports.createOpportunity = async (req, res) => {
  const weighted_amount = req.body.amount * (req.body.scotsman / 100);
  const opportunity = new Opportunity({
    account_name: req.body.account_name,
    account_id: req.body.account_id,
    name: req.body.name,
    amount: req.body.amount,
    timing: req.body.timing,
    scotsman: req.body.scotsman,
    weighted_amount,
    status: req.body.status,
    order_received: false,
    deleted_opportunity: false,
    sales_rep: req.user._id // When deployed change this to req.user._id
  });

  await opportunity.save(async (err, file, rows) => {
    const backURL = req.header('Referer') || '/';
    if (err) {
      req.flash('error', err.message)
      res.redirect(backURL);
    };
    if (!err) {
      createActivity(file.account_name, 'opportunity', 'create', req.user._id);
      console.log("Hi added to the db")
    };
  });
  req.flash("success", "Your opportunity has been saved!");
  res.redirect('/opportunities');
};

exports.getAllOpportunities = async (req, res) => {

  const oppsByAccount = await Opportunity.getOpportunitiesByCustomer(req.user._id);
  console.log("oppsByAccount", oppsByAccount);
  res.render("opportunities", { title: 'Your Opportunities', oppsByAccount });
};

exports.getOpportunity = async (req, res) => {
  const opp = await Opportunity.findOne({_id: req.params.id});
  console.log(opp);
  res.render('editOpp', {title: 'Edit your opportunity',  opportunity: opp});
}

exports.updateOpportunity = async (req, res) => {
  // delete the previous
  if(req.body.order_received === 'on'){
    req.body.order_received = true;
  }
  const obj = {
    deleted_opportunity: true
  };
  const x = await Opportunity.findByIdAndUpdate({_id: req.body.parent_id}, {deleted_opportunity: true});

  if(!req.body.order_received) {req.body.order_received = false;}
  const weighted_amount = req.body.amount * (req.body.scotsman / 100);
  req.body.weighted_amount = weighted_amount;
  const opportunity = new Opportunity({
    account_name: req.body.account_name,
    name: req.body.name,
    amount: req.body.amount,
    timing: req.body.timing,
    scotsman: req.body.scotsman,
    weighted_amount,
    status: req.body.status,
    order_received: req.body.order_received,
    original_id: req.body.original_id,
    deleted_opportunity: false,
    sales_rep: req.user._id // When deployed change this to req.user._id
  });

  await opportunity.save((err, file, rows) => {
    if (err) console.log(err);
    if (!err) console.log("Hi added to the db");
  });
  req.flash("success", "Your opportunity has been updated!");
  res.redirect('/opportunities')
}

exports.getHistoricalOpp = async (req, res) => {
  let hisOpps;
  await Opportunity.find({original_id: req.params.id, deleted_opportunity: true})
  .sort({created_on: -1}).exec(function(err, docs) { 
    res.json(docs);
   });;
}