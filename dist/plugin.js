"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _postcss = _interopRequireDefault(require("postcss"));
var _tailwindcss = _interopRequireDefault(require("tailwindcss"));
var _fs = _interopRequireDefault(require("fs"));
var _tailwind = require("./factory/tailwind");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

function _default(_ref) {
  var t = _ref.types;
  var imported = false;
  var keys = ["aasdfasd", "sadasdas"];
  var _id = 0;
  return {
    name: "tailwind-factory",
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var source = path.node.source.value;
        if (!imported && source === "tailwind-factory") {
          imported = true;
        }
      },
      CallExpression: function CallExpression(path, state) {
        var callee = path.node.callee;
        var methodArguments = path.node.arguments;
        if (imported && (callee.type === "Identifier" || callee.type === "V8IntrinsicIdentifier") && callee.name === "tf") {
          _id++;
          var id = _id;
          if (methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            var quasis = methodArguments[1].quasis[0];
            var reference = "factory__".concat(keys[id]);
            (0, _postcss["default"])((0, _tailwindcss["default"])({
              content: [{
                raw: (0, _tailwind.removeWhiteSpaceInClasses)(quasis.value.raw)
              }]
            })).process("@tailwind utilities;").then(function (res) {
              var _config$styles;
              var config = state.opts;
              var stylesPath = config === null || config === void 0 ? void 0 : (_config$styles = config.styles) === null || _config$styles === void 0 ? void 0 : _config$styles.path;
              if (stylesPath) {
                _fs["default"].writeFile(stylesPath, res.css, function (err) {
                  if (err) {
                    console.log("[Factory] Unable to generate styles");
                  }
                  console.log("[Factory] Styles created!");
                });
              } else {
                console.log("[Factory] Styles path not defined");
              }
            });

            //Prop `className` did not match. 

            //Server: "factory__sadasdas" 
            //Client: "hover:text-red-500 md:flex first-letter:rounded-none placeholder:text-red-200 after:text-sm checked:text-md bg-blue-200 test custom-css"

            //I think it's because I'm changing the value of the function's 
            //argument and not the component's property. I'll think about it.
            quasis.value.raw = reference;
          }
        }
      }
    }
  };
}