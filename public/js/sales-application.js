import setToolTips from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';
import {animateLogin} from './modules/loginAnimation';
import {addLocationRow, submitForm, showEmailField} from './modules/createPcf';
import {deleteFlash} from './modules/flashes';

const x = document.getElementById('pcf');
const loginField = document.querySelector('.login-field');
const pcf = document.getElementById('createpcf')
const flash = document.querySelector('.flash');

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