"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingIcon = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireWildcard(require("styled-components"));

var _templateObject, _circle;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var StyledSvg = _styledComponents.default.svg(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n    fill: white;\n    color: white;\n    width: 24px;\n    height: 24px;\n    animation: anim-rotate 1.4s linear infinite;\n    circle {\n        stroke: currentColor;\n        stroke-dasharray: 80px, 200px;\n        stroke-dashoffset: 0;\n        animation: anim-dash 1.4s ease-in-out infinite;\n    }\n    @keyframes anim-rotate {\n        100% {\n            transform: rotate(360deg);\n        }\n    }\n    @keyframes anim-dash {\n        0% {\n            stroke-dasharray: 1px, 200px;\n            stroke-dashoffset: 0;\n        }\n        50% {\n            stroke-dasharray: 100px, 200px;\n            stroke-dashoffset: -15px;\n        }\n        100% {\n            stroke-dasharray: 100px, 200px;\n            stroke-dashoffset: -120px;\n        }\n    }\n"])));

var LoadingIcon = function LoadingIcon(_ref) {
  var className = _ref.className;
  return /*#__PURE__*/_react.default.createElement(StyledSvg, {
    xmlns: "http://www.w3.org/2000/svg",
    width: "48",
    height: "48",
    viewBox: "22 22 44 44",
    className: className
  }, _circle || (_circle = /*#__PURE__*/_react.default.createElement("circle", {
    cx: "44",
    cy: "44",
    r: "20.2",
    fill: "none",
    strokeWidth: "3.6"
  })));
};

exports.LoadingIcon = LoadingIcon;