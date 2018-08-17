const CronJob = require('cron').CronJob;
const bot = require('./bot');


const checkOpportunityJob = new CronJob({
    cronTime: '00 38 13 * * *',
    onTick: bot.start(),
    start: true,
    timeZone: 'Europe/Amsterdam'
});