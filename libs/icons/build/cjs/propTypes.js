"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconsPropType = exports.colorsPropType = void 0;

var _propTypes = require("prop-types");

var _colors = require("./colors");

var _icons = require("./icons");

var colorsPropType = (0, _propTypes.oneOf)(Object.keys(_colors.colors).map(function (key) {
  return _colors.colors[key];
}));
exports.colorsPropType = colorsPropType;
var iconsPropType = (0, _propTypes.oneOf)(Object.keys(_icons.icons).map(function (key) {
  return _icons.icons[key];
}));
exports.iconsPropType = iconsPropType;