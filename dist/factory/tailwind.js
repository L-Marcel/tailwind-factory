"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/factory/tailwind.tsx
var tailwind_exports = {};
__export(tailwind_exports, {
  getStyledElementClassName: () => getStyledElementClassName,
  removeWhiteSpaceInClasses: () => removeWhiteSpaceInClasses
});
module.exports = __toCommonJS(tailwind_exports);
function removeWhiteSpaceInClasses(classes) {
  const whitespace = /(\r|\t)/g;
  const lineBreak = /(\n)/g;
  let formattedClasses = classes;
  if (whitespace.test(formattedClasses)) {
    formattedClasses = formattedClasses.replace(whitespace, "");
  }
  if (lineBreak.test(formattedClasses)) {
    const allFormattedClasses = formattedClasses.split(lineBreak);
    try {
      return allFormattedClasses.filter((rawClass) => {
        return !!rawClass && rawClass !== "\n";
      }).map((rawClass) => {
        return rawClass.trim();
      }).join(" ");
    } catch (e) {
      return "";
    }
  }
  return formattedClasses;
}
function getStyledElementClassName(styles, variantProps, variantStyles) {
  const props = variantProps;
  const dynamicStyles = variantStyles;
  const _variantStyles = Object.entries(dynamicStyles).map(([key, values]) => {
    const variantStyle = values[props[key]];
    return removeWhiteSpaceInClasses(variantStyle);
  });
  const _styles = removeWhiteSpaceInClasses(styles);
  return `${_styles}${_variantStyles.length >= 1 && _styles ? " " : ""}${_variantStyles.join(" ")}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStyledElementClassName,
  removeWhiteSpaceInClasses
});
