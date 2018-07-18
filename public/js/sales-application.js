import setToolTips from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';
import {animateLogin} from './modules/loginAnimation';
import {addLocationRow, submitForm} from './modules/createPcf';

const x = document.getElementById('pcf');
const loginField = document.querySelector('.login-field');
const pcf = document.getElementById('createpcf')

setToolTips();
pcfButtonNavigate(x);
backArrowFunc(x);
calcRoi(x);
roiAgain(x);
animateLogin(loginField);
addLocationRow(pcf);
submitForm(pcf);