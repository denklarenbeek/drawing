const Activity = require('../models/Activity');

exports.createActivity = async (name, category, type, person, created_on) => {
    const activity = new Activity({
        name: name,
        created_on: created_on,
        category: category,
        type: type,
        sales_rep: person
    });
    try {
        await activity.save();
    } catch(err){
        console.log(err)
    }
};