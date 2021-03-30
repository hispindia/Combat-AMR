"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyledSvg = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _propTypes = require("prop-types");

var _propTypes2 = require("../propTypes");

var _colors = require("../colors");

var _templateObject, _templateObject2, _templateObject3;

var StyledSvg = _styledComponents.default.svg(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n    width: 24px;\n    height: 24px;\n    flex-shrink: 0;\n    ", "\n"])), function (_ref) {
  var size = _ref.size,
      color = _ref.color;
  if (size) return (0, _styledComponents.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n                margin: auto;\n                width: ", "px;\n                height: ", "px;\n            "])), size, size);
  if (color) return (0, _styledComponents.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n                fill: ", ";\n            "])), _colors.colors[color]);
});

exports.StyledSvg = StyledSvg;
StyledSvg.propTypes = {
  size: _propTypes.number,
  color: _propTypes2.colorsPropType
};