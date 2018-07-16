import setToolTips from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';

const x = document.getElementById('pcf');

setToolTips();
pcfButtonNavigate(x);
backArrowFunc(x);
calcRoi(x);
roiAgain(x);