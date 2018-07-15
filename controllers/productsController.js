const mongoose = require('mongoose');
const Product = require('../models/Product');


exports.createProduct = async (req, res, next) => {
    const body = JSON.parse(req.body.prices);
    console.log(body);
    const product = await new Product({
      name: req.body.name,
      prices: body
    });
    await product.save((err, file, rows) => {
      if(err) console.log(err);
      
      res.json(file);
    });
}