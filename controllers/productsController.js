const mongoose = require('mongoose');
const Product = require('../models/Product');
const pcfID = '5b4a8871937047b6d7ff47ec';

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

exports.getOneProduct = async (req, res, next ) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
}