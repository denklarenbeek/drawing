import setToolTips from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';
import {animateLogin} from './modules/loginAnimation';
import {addLocationRow, submitForm, showEmailField} from './modules/createPcf';
import {deleteFlash} from './modules/flashes';
import {showHistoryOpp} from './modules/showHistoryOpp';
import {searchOpportunities} from './modules/searchOpp';
import {updateCronJobTimer, updateCronJobDays, updateCronJobActive} from './modules/changeSettings';

const x = document.getElementById('pcf');
const loginField = document.querySelector('.login-field');
const pcf = document.getElementById('createpcf')
const flash = document.querySelector('.flash');
const opp = document.getElementById('opportunities');
const searchInput = document.getElementById('searchInput');
const cronInput = document.getElementById('cron_jobs_timer');

setToolTips();
pcfButtonNavigate(x);
backArrowFunc(x);
calcRoi(x);
roiAgain(x);
animateLogin(loginField);
addLocationRow(pcf);
submitForm(pcf);
showEmailField(pcf);
deleteFlash(flash);
showHistoryOpp(opp)
searchOpportunities(searchInput);
updateCronJobTimer(cronInput);
updateCronJobDays(cronInput);
updateCronJobActive(cronInput);