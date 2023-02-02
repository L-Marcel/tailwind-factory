"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStyledElementClassName = getStyledElementClassName;
exports.removeWhiteSpaceInClasses = removeWhiteSpaceInClasses;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function removeWhiteSpaceInClasses(classes) {
  var whitespace = /(\r|\t)/g;
  var lineBreak = /(\n| )/g;
  var formattedClasses = classes;
  if (whitespace.test(formattedClasses)) {
    formattedClasses = formattedClasses.replace(whitespace, "");
  }
  if (lineBreak.test(formattedClasses)) {
    var allFormattedClasses = formattedClasses.split(lineBreak);
    try {
      return allFormattedClasses.filter(function (rawClass) {
        rawClass = rawClass.trim();
        return !!rawClass && rawClass !== "\n";
      }).map(function (rawClass) {
        //yes, is necessary...
        return rawClass.trim();
      }).join(" ");
    } catch (_unused) {
      return "";
    }
  }
  return formattedClasses;
}
function getStyledElementClassName(styles, variantProps, variantStyles) {
  var props = variantProps;
  var dynamicStyles = variantStyles;
  var _variantStyles = Object.entries(dynamicStyles).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      values = _ref2[1];
    var params = Object.getOwnPropertyNames(values);
    var value = props[key];
    if (params.includes("true") && Number(value) === 1 || params.includes("false") && Number(value) === 0) {
      value = Boolean(value);
    } else if (params.includes("1") && Boolean(value) === true || params.includes("0") && Boolean(value) === false) {
      value = Number(value);
    }
    var variantStyle = values[String(value)];
    return removeWhiteSpaceInClasses(variantStyle);
  });
  var _styles = removeWhiteSpaceInClasses(styles);
  return "".concat(_styles).concat(_variantStyles.length >= 1 && _styles ? " " : "").concat(_variantStyles.join(" "));
}