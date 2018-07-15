const mongoose = require('mongoose');
const Product = require('../models/Product');

const pcfID = '5b4a8871937047b6d7ff47ec';

exports.calculateROI = async (req, res, next) => {
    const client = req.query.client;
    const improvement = req.query.improvement;
    let volume;
    let marginimpr;
    let volumeimpr;
    let marge;
    let rendement;
    let rois = [];
    const product = await Product.findById(pcfID);

    const productRelated = product.prices.filter(obj => {
        return obj.client === client
    });

    for(let i=0;i < productRelated.length; i++){
        const investment = productRelated[i].fee * 12;
        const returnProduct = {};
        returnProduct.fee = productRelated[i].fee
        returnProduct.setup = productRelated[i].setup
        returnProduct.duration = productRelated[i].duration

        if(improvement === 'volume'){
            volumeimpr = req.query.volumeimpr;
            marge = req.query.margin;
            rendement = (volumeimpr * marge) * 52;
        };

        if(improvement === 'margin'){
            volume = req.query.volume;
            marginimpr = req.query.marginimpr;
            rendement = (volume * marginimpr) * 52;
        };

        const roi = (rendement / investment) * 100;
        returnProduct.roi = roi;
        rois.push(returnProduct);
    }

    res.json(rois);
}