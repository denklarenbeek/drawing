const CronJob = require('cron').CronJob;
const Opportunity = require('../models/Opportunity');
const User = require('../models/User');
const mail = require('../handlers/mailer');
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

const checkOpportunityJob = new CronJob({
    cronTime: '00 00 08 * * 1-5',
    onTick: async function(){
        const users = await User.find();
        let outdated = [];
        for(let i = 0; i < users.length; i++){
            console.log(users[i].cron_jobs_timer);
            const x = await checkOnDate(users[i].cron_jobs_timer, users[i]._id);
            if(x.length !== 0) {
                users[i].outdated = x;
                const options = {
                    fromName: 'Administrator',
                    froEmail: 'sales@applicatie.nl',
                    toEmail: users[i].email,
                    toName: users[i].name,
                    subject: 'Bijna verlopen opportunities',
                    template: 'opportunities',
                    opportunities: x,
                    expiringTime: users[i].cron_jobs_timer
                }
                // Send mail to users
                await mail.send(options)
            }
        }
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});