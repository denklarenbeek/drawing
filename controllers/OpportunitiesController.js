'use strict';

const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");
const {createActivity} = require('../handlers/activityLogger');
const multer = require('multer');
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");

const storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './tmp/')
  },
  filename: function (req, file, cb) {
      const datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

const upload = multer({ //multer settings
  storage: storage
}).single('file');

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
  console.log(req.user._id);
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
    if (!err) {
      createActivity('updated', 'opportunity', 'update', req.user._id);
      console.log("Hi added to the db")
    };
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

exports.importOpps = async (req, res) => {
  upload(req, res, function(err){
    let exceltojson;
    //Check if the upload works
    if(err){
      console.log({err: err})
      req.flash('error', err);
      res.redirect('/admin');
    }
    //Check if there is a file on the request object
    if(!req.file){
      console.log('error no req.file', err);
      req.flash('error', 'Please provide a file');
      res.redirect('/admin');
    }

    if (['xls', 'xlsx'].indexOf(req.file.originalname.split('.')[req.file.originalname.split('.').length-1]) === -1) {
      console.log('Not the right format');
      req.flash('error', 'Please provide a right format for the upload');
      res.redirect('/admin');
    }

    // Check if the file is a xlsx or xls file
    if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }

    try {
      exceltojson({
        input: req.file.path,
        output: null,
        lowerCaseHeaders: true
      }, async function(err, result){
        if(err) {
          console.log('error on parsing', err)
        }
        // upload every row in result
        try {
          for(let i =0; i <result.length; i++){
            const opp = new Opportunity(result[i]);
            await opp.save((err, file ,rows) => {
              if(err) {
                req.flash('error', err)
              }
            })
          }
          req.flash('success', 'Your opportunities are imported');
          res.redirect('/opportunities')
        } catch(e){
          console.log(e)
        }
      })
    } catch (e){
      console.log(e)
    }
  });
};