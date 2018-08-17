const Opportunity = require('./models/Opportunity');
const User = require('./models/User');
const mail = require('./handlers/mailer');
const moment = require('moment');

function convertDaysIntoMS(days){
    return (days * (1000 * 60 * 60 * 24));
}

async function checkOnDate(date, user){
    // convert date number in to miliseconds
    const miliseconds = convertDaysIntoMS(date);
    const opps = await Opportunity.find({deleted_opportunity: false, order_received: false, sales_rep: user});
    const outdatedOpps = opps.filter(el => {
        return el.timing < new Date(Date.now() + miliseconds);
    });
    outdatedOpps.map(async (el) => {
        el.date = await moment(el.timing).format('DD MM YYYY');
    })
    return outdatedOpps;
}

module.exports = {
    start: async function(){
        console.log('start cron job');
        const users = await User.find();

        //Filter if the User who want a notification
        const jobUsers = await users.filter(el => {
            return el.cron_jobs === true;
        });

        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let today = new Date().getDay();
        let todayName = days[today];

        //Filter if the Users who want a notification today
        const todayUsers = await jobUsers.filter(el => {
            return el.cron_jobs_day[todayName] === true;
        });

        console.log(todayUsers.length);

        for(let i = 0; i < todayUsers.length; i++){
            console.log(todayUsers[i].cron_jobs_timer);
            const x = await checkOnDate(todayUsers[i].cron_jobs_timer, todayUsers[i]._id);
            console.log(x);
            console.log(i);
            if(x.length !== 0) {
                todayUsers[i].outdated = x;
                const options = {
                    fromName: 'Administrator',
                    froEmail: 'sales@applicatie.nl',
                    toEmail: todayUsers[i].email,
                    toName: todayUsers[i].name,
                    subject: 'Bijna verlopen opportunities',
                    template: 'opportunities',
                    opportunities: x,
                    expiringTime: todayUsers[i].cron_jobs_timer
                }
                // Send mail to users
                await mail.send(options)
            }
        };
    }
}