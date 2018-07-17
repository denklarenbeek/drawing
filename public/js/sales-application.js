import setToolTips from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';
import {animateLogin} from './modules/loginAnimation';

const x = document.getElementById('pcf');
const loginField = document.querySelector('.login-field');

setToolTips();
pcfButtonNavigate(x);
backArrowFunc(x);
calcRoi(x);
roiAgain(x);
animateLogin(loginField);