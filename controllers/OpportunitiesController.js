const mongoose = require("mongoose");
const Opportunity = require("../models/Opportunity");

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
    sales_rep: req.body.sales_rep // When deployed change this to req.user._id
  });

  await opportunity.save((err, file, rows) => {
    if (err) console.log(err);
    if (!err) console.log("Hi added to the db");
  });
  req.flash("success", "Your opportunity has been saved!");
  res.json({ msg: "added!" });
};

exports.getAllOpportunities = async (req, res) => {

  const oppsByAccount = await Opportunity.getOpportunitiesByCustomer();
  console.log("oppsByAccount", oppsByAccount);
  res.render("opportunities", { oppsByAccount });
};
