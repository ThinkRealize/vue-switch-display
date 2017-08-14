'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _switchDisplay = require('./directive/switch-display');

var install = function install(Vue) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (install.installed) return;
  Vue.directive('switch-display-controler', _switchDisplay.controler);
  Vue.directive('switch-display-child', _switchDisplay.child);
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

exports.default = install;