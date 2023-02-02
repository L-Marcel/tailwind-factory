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
          console.log(callee.start, " - Factory called!");
          if (methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            var quasis = methodArguments[1].quasis[0];
            (0, _postcss["default"])((0, _tailwindcss["default"])({
              content: [{
                raw: (0, _tailwind.removeWhiteSpaceInClasses)(quasis.value.raw)
              }]
            })).process("@tailwind utilities;").then(function (res) {
              var _config$styles;
              var config = state.opts;
              var stylesPath = config === null || config === void 0 ? void 0 : (_config$styles = config.styles) === null || _config$styles === void 0 ? void 0 : _config$styles.path;

              //res.css -> tailwind generate styles
              console.log("Tailwind styles: ", res.css);
              if (stylesPath) {
                _fs["default"].writeFile(stylesPath, ".test { background: red; }", function (err) {
                  if (err) {
                    console.log(stylesPath, err);
                    console.log("[Factory] Unable to generate styles");
                  }

                  //I will create custom styles
                  console.log("[Factory] Styles created!");
                });
              } else {
                console.log("[Factory] Styles path not defined");
              }
            });
          }
        }
      }
    }
  };
}