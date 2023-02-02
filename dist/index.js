"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "removeWhiteSpaceInClasses", {
  enumerable: true,
  get: function get() {
    return _tailwind.removeWhiteSpaceInClasses;
  }
});
exports.tf = tf;
var _react = require("react");
var _tailwind = require("./factory/tailwind");
var _uniteProperties = require("./utils/uniteProperties");
var _post = require("./post");
var _parseToChildren = require("./utils/parseToChildren");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function tf(element) {
  var styles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var definedVariants = config !== null && config !== void 0 && config.variants ? Object.entries(config === null || config === void 0 ? void 0 : config.variants).reduce(function (prev, _ref) {
    var _ref2 = _slicedToArray(_ref, 1),
      key = _ref2[0];
    prev.push(key);
    return prev;
  }, []) : [];
  function CreatedElement(props) {
    var _Object$entries$reduc = Object.entries(props).reduce(function (prev, _ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];
        if (definedVariants.includes(key)) {
          Object.assign(prev.variants, _defineProperty({}, key, value));
        } else {
          if (key === "children") {
            value = (0, _parseToChildren.parseToChildren)(value);
          }
          Object.assign(prev.elementProps, _defineProperty({}, key, value));
        }
        return prev;
      }, {
        elementProps: {},
        variants: _objectSpread({}, (config === null || config === void 0 ? void 0 : config.defaultVariants) || {})
      }),
      elementProps = _Object$entries$reduc.elementProps,
      variants = _Object$entries$reduc.variants;

    //temporary
    var styleClasses = typeof styles === "string" ? styles : "";
    if (typeof styles !== "string") {
      console.log("styles: ", styles);
    }
    var elementClassName = (0, _tailwind.getStyledElementClassName)(styleClasses, variants, (config === null || config === void 0 ? void 0 : config.variants) || {});
    var classNameInProps = elementProps !== null && elementProps !== void 0 && elementProps.className ? "".concat(elementClassName ? " " : "").concat((0, _tailwind.removeWhiteSpaceInClasses)(elementProps === null || elementProps === void 0 ? void 0 : elementProps.className)) : "";
    var className = elementClassName + classNameInProps;
    var children = elementProps === null || elementProps === void 0 ? void 0 : elementProps.children;
    if (className.includes("{") && className.includes("}")) {
      var _Post$children = _post.Post.children(children, className),
        newChildren = _Post$children.newChildren,
        newClassNames = _Post$children.newClassNames;
      children = newChildren;
      className = newClassNames;
    }
    return /*#__PURE__*/(0, _react.createElement)(element, _objectSpread(_objectSpread({}, elementProps), {}, {
      className: className
    }), children);
  }
  function extendsElement(newElement) {
    var newStyles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var newConfig = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var extendedConfig = (0, _uniteProperties.uniteProperties)(config, newConfig);
    var definedVariants = extendedConfig !== null && extendedConfig !== void 0 && extendedConfig.variants ? Object.entries(extendedConfig === null || extendedConfig === void 0 ? void 0 : extendedConfig.variants).reduce(function (prev, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 1),
        key = _ref6[0];
      prev.push(key);
      return prev;
    }, []) : [];
    function CreatedExtendedElement(props) {
      var _Object$entries$reduc2 = Object.entries(props).reduce(function (prev, _ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
            key = _ref8[0],
            value = _ref8[1];
          if (definedVariants.includes(key)) {
            Object.assign(prev.variants, _defineProperty({}, key, String(value)));
          } else {
            if (key === "children") {
              value = (0, _parseToChildren.parseToChildren)(value);
            }
            Object.assign(prev.elementProps, _defineProperty({}, key, value));
          }
          return prev;
        }, {
          elementProps: {},
          variants: _objectSpread({}, (extendedConfig === null || extendedConfig === void 0 ? void 0 : extendedConfig.defaultVariants) || {})
        }),
        elementProps = _Object$entries$reduc2.elementProps,
        variants = _Object$entries$reduc2.variants;
      var elementClassName = (0, _tailwind.getStyledElementClassName)(styles + (styles ? " " : "") + newStyles, variants, (extendedConfig === null || extendedConfig === void 0 ? void 0 : extendedConfig.variants) || {});
      var classNameInProps = elementProps !== null && elementProps !== void 0 && elementProps.className ? "".concat(elementClassName ? " " : "").concat((0, _tailwind.removeWhiteSpaceInClasses)(elementProps === null || elementProps === void 0 ? void 0 : elementProps.className)) : "";
      var className = elementClassName + classNameInProps;
      var children = elementProps === null || elementProps === void 0 ? void 0 : elementProps.children;
      if (className.includes("{") && className.includes("}")) {
        var _Post$children2 = _post.Post.children(children, className),
          newChildren = _Post$children2.newChildren,
          newClassNames = _Post$children2.newClassNames;
        children = newChildren;
        className = newClassNames;
      }
      return /*#__PURE__*/(0, _react.createElement)(newElement !== null && newElement !== void 0 ? newElement : element, _objectSpread(_objectSpread({}, elementProps), {}, {
        className: className
      }), children);
    }
    return Object.assign(CreatedExtendedElement, {
      "extends": extendsElement
    });
  }
  return Object.assign(CreatedElement, {
    "extends": extendsElement
  });
}