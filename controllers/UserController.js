const User = require('../models/User');

exports.updateJobTimer = async (req, res) => {
    const user = req.user;
    user.cron_jobs_timer = req.body.cron_jobs_timer;
    console.log('user', user)
    await User.findByIdAndUpdate(req.user._id, user, {new:true}, (err, doc) => {
        if(err){
            res.json({code: 1, err});
        }
        res.json({code: 0, doc})
    });
}

exports.updateJobActive = async (req, res) => {
    const user = req.user;
    user.cron_jobs = req.body.cron_jobs;
    if(!req.body.cron_jobs){
        user.cron_jobs_day = {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
        };
        user.cron_jobs_timer = null;
    }
    console.log(req.body);
    await User.findByIdAndUpdate(req.user._id, user, {new: true}, (err, doc) => {
        if(err) {
            res.json({code: 1, err})
        }
        res.json({code: 0, doc})

    });
};

exports.updateJobDays = async (req, res) => {
    const user = req.user;
    const i = Object.keys(req.body);
    const val = req.body[i];
    user.cron_jobs_day[i] = val;
    await User.findByIdAndUpdate(req.user._id, user, {new: true}, (err, doc) => {
        if(err){
            res.json({code: 1, err})
        }
        res.json({code: 0, doc})
    })

}

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.render('admin', {title: 'Admin section', users});
}



// const user = req.user;
    // user.cron_jobs = req.body.cron_jobs || req.user.cron_jobs;
    // user.cron_jobs_day.monday = req.body.cron_jobs_day.monday || req.user.cron_jobs_day.monday;
    // user.cron_jobs_day.tuesday = req.body.cron_jobs_day.tuesday || req.user.cron_jobs_day.tuesday;
    // user.cron_jobs_day.wednesday = req.body.cron_jobs_day.wednesday || req.user.cron_jobs_day.wednesday;
    // user.cron_jobs_day.thursday = req.body.cron_jobs_day.thursday || req.user.cron_jobs_day.thursday;
    // user.cron_jobs_day.friday = req.body.cron_jobs_day.friday || req.user.cron_jobs_day.friday;
    // user.cron_jobs_day.saturday = req.body.cron_jobs_day.saturday || req.user.cron_jobs_day.saturday;
    // user.cron_jobs_day.sunday = req.body.cron_jobs_day.sunday || req.user.cron_jobs_day.sunday;