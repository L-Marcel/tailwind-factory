"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringToArray = stringToArray;
function stringToArray(value) {
  var haveSpace = / /g.test(value !== null && value !== void 0 ? value : "");
  var mapOfString = value ? haveSpace ? value === null || value === void 0 ? void 0 : value.split(" ") : [value] : [];
  return mapOfString;
}