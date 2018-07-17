const mongoose = require('mongoose');
const Product = require('../models/Product');

const pcfID = '5b4a8871937047b6d7ff47ec';

function calclulateTableROI(data, productRelated){
    const improvement = data.improvement;
    let volume;
    let marginimpr;
    let volumeimpr;
    let marge;
    let rendement;

    const investment = productRelated.fee * 12;
    const returnProduct = {};
    returnProduct.fee = productRelated.fee
    returnProduct.setup = productRelated.setup
    returnProduct.duration = productRelated.duration

    if(improvement === 'volume'){
        volumeimpr = data.volumeimpr;
        marge = data.margin;
        rendement = (volumeimpr * marge) * 52;
    };

    if(improvement === 'margin'){
        volume = data.volume;
        marginimpr = data.marginimpr;
        rendement = (volume * marginimpr) * 52;
    };

    const roi = (rendement / investment) * 100;
    returnProduct.roi = roi;
    return returnProduct;
}

exports.calculateROI = async (req, res, next) => {
    let rois = [];
    const product = await Product.findById(pcfID);

    const productRelated = product.prices.filter(obj => {
        return obj.client === req.query.client
    });

    for(let i=0; i < productRelated.length; i++){
        const returnProduct = calclulateTableROI(req.query, productRelated[i]);
        rois.push(returnProduct);
    }
    res.json(rois);
}