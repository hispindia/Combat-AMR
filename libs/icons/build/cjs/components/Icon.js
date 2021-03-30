"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = require("prop-types");

var _StyledSvg = require("./StyledSvg");

var _propTypes2 = require("../propTypes");

var Icon = function Icon(_ref) {
  var icon = _ref.icon,
      color = _ref.color,
      size = _ref.size;
  return /*#__PURE__*/_react.default.createElement(_StyledSvg.StyledSvg, {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    color: color,
    size: size
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: icon
  }));
};

exports.Icon = Icon;
Icon.propTypes = {
  icon: _propTypes2.iconsPropType.isRequired,
  size: _propTypes.number,
  color: _propTypes2.colorsPropType
};