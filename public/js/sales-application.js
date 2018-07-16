import test from './modules/tooltip';
import {pcfButtonNavigate, backArrowFunc, calcRoi, roiAgain} from './modules/pcf';

const x = document.getElementById('pcf');

test();
pcfButtonNavigate(x);
backArrowFunc(x);
calcRoi(x);
roiAgain(x);