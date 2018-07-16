/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var tab = 1;
var client = void 0;
var improvement = void 0;

function formatPrices(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol"
  });
}

function showHideArrow(tabNr) {
  var arrow = document.querySelector(".back-arrow i");
  if (tabNr === 1 || tabNr === 4) {
    arrow.style.display = "none";
  } else {
    arrow.style.display = "block";
  }
}

function pcfButtonNavigate(el) {
  if (!el) return;

  var buttons = document.querySelectorAll("button");

  var _loop = function _loop(i) {
    buttons[i].addEventListener("click", function () {
      // remove active class from current
      var activeSection = document.querySelector("section.active");
      activeSection.classList.remove("active");

      // Set new tab number
      tab++;

      // save value in variable
      if (buttons[i].dataset.client) {
        client = buttons[i].dataset.client;
      }
      if (buttons[i].dataset.improvement) {
        improvement = buttons[i].dataset.improvement;
      }

      // render right section
      var search = void 0;
      if (tab === 3) {
        search = "pcf-" + improvement;
      } else {
        search = "pcf-" + tab;
      }

      var newSection = document.getElementById(search);
      newSection.classList.add("active");

      showHideArrow(tab);
    });
  };

  for (var i = 0; i < buttons.length; i++) {
    _loop(i);
  }
}

function backArrowFunc(el) {
  if (!el) return;

  var backArrow = document.querySelector(".back-arrow i");

  backArrow.addEventListener("click", function () {
    var activeSection = document.querySelector("section.active");
    activeSection.classList.remove("active");

    tab--;

    var search = "pcf-" + tab;
    var newSection = document.getElementById(search);
    newSection.classList.add("active");
    showHideArrow(tab);
  });
}

function calcRoi(el) {
  if (!el) return;

  var form = document.querySelectorAll(".pcf-calculate-form");
  for (var i = 0; i < form.length; i++) {
    form[i].addEventListener("submit", function (e) {
      e.preventDefault();

      var marginimpr = document.getElementById("marge-impr").value;
      var volume = document.getElementById("volume").value;
      var volumeimpr = document.getElementById("volume-impr").value;
      var margin = document.getElementById("margin").value;

      //axios request naar api!
      axios.get("/api/v1/calculate-roi?client=" + client + "&improvement=" + improvement + "&marginimpr=" + marginimpr + "&volume=" + volume + "&volumeimpr=" + volumeimpr + "&margin=" + margin).then(function (res) {
        var activeSection = document.querySelector("section.active");
        activeSection.classList.remove("active");
        tab++;
        var newSection = document.getElementById("pcf-roi-table");
        var roiTable = document.querySelector('#pcf-roi-table table tbody');
        var childDivs = roiTable.children;
        var data = res.data;
        for (var _i = 0; _i < childDivs.length; _i++) {
          var feeP = childDivs[_i].children[1];
          var modFeeP = res.data[_i].fee;
          feeP.innerHTML = "\u20AC " + modFeeP;
          var roiP = childDivs[_i].children[2];
          var modRoiP = Math.floor(res.data[_i].roi) + "%";
          roiP.innerHTML = modRoiP;
          var setupP = childDivs[_i].children[3];
          var modSetupP = res.data[_i].setup;
          setupP.innerHTML = "\u20AC " + modSetupP;
        }

        newSection.classList.add("active");
        showHideArrow(tab);
      }).catch(function (err) {
        console.log(err);
      });
      //
    });
  }
}

function roiAgain(el) {
  if (!el) return;

  var button = document.getElementById('calc-roi-again');
  button.addEventListener('click', function (e) {
    e.preventDefault();
    location.reload();
  });
}

exports.pcfButtonNavigate = pcfButtonNavigate;
exports.backArrowFunc = backArrowFunc;
exports.calcRoi = calcRoi;
exports.roiAgain = roiAgain;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function setToolTips() {

  var labels = [].concat(_toConsumableArray(document.querySelectorAll('.tooltip')));

  var _loop = function _loop(i) {
    var inputContainer = labels[i];
    var tooltip = document.createElement('div');
    tooltip.className = 'tooltip-container';
    var icon = document.createElement('i');
    icon.className = 'fal fa-info-circle tooltip';
    var tipText = labels[i].dataset.tooltipinfo;
    var span = document.createElement('span');
    span.className = 'tooltip';
    span.innerHTML = tipText;
    var arrow = document.createElement('i');
    arrow.className = 'tooltip-arrow';
    icon.addEventListener('click', function () {
      span.style.display = 'inline-block';
      arrow.style.display = 'inline-block';
      setTimeout(function () {
        span.style.display = 'none';
        arrow.style.display = 'none';
      }, 5000);
    });

    tooltip.appendChild(icon);
    tooltip.appendChild(span);
    tooltip.appendChild(arrow);
    inputContainer.appendChild(tooltip);
  };

  for (var i = 0; i < labels.length; i++) {
    _loop(i);
  };
};

exports.default = setToolTips;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _tooltip = __webpack_require__(1);

var _tooltip2 = _interopRequireDefault(_tooltip);

var _pcf = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var x = document.getElementById('pcf');

(0, _tooltip2.default)();
(0, _pcf.pcfButtonNavigate)(x);
(0, _pcf.backArrowFunc)(x);
(0, _pcf.calcRoi)(x);
(0, _pcf.roiAgain)(x);

/***/ })
/******/ ]);
//# sourceMappingURL=App.bundle.js.map