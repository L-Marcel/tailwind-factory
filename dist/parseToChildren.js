"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseToChildren = parseToChildren;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable @typescript-eslint/no-explicit-any */

function parseToChildren(value) {
  var children = _react["default"].Children.toArray(value);
  for (var c in children) {
    var _children$c, _children$c$props;
    var newChildren = children[c];
    var isObject = typeof children[c] !== "string" && typeof children[c] !== "number" && ((_children$c = children[c]) === null || _children$c === void 0 ? void 0 : (_children$c$props = _children$c.props) === null || _children$c$props === void 0 ? void 0 : _children$c$props.children);
    if (isObject) {
      var _children$c2, _children$c2$props;
      newChildren = _objectSpread(_objectSpread({}, newChildren), {}, {
        props: _objectSpread(_objectSpread({}, newChildren.props), {}, {
          children: parseToChildren((_children$c2 = children[c]) === null || _children$c2 === void 0 ? void 0 : (_children$c2$props = _children$c2.props) === null || _children$c2$props === void 0 ? void 0 : _children$c2$props.children)
        })
      });
      children[c] = newChildren;
    }
  }
  return children;
}