"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports["default"]=void 0;var _babelPluginMacros=require("babel-plugin-macros");/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/no-non-null-assertion */var _default=(0,_babelPluginMacros.createMacro)(tf,{configName:"tailwind-factory"});exports["default"]=_default;function tf(_ref){var references=_ref.references,state=_ref.state,babel=_ref.babel;references["default"].forEach(function(referencePath){if(referencePath.parentPath.type==="CallExpression"){if(referencePath===referencePath.parentPath.get("callee")){var macroArguments=referencePath.parentPath.get("arguments");if(Array.isArray(macroArguments)&&macroArguments.length>=2){var classes=macroArguments[1].node.quasis[0].value.raw;var haveSpace=/\n/g.test(classes);var styles=haveSpace?classes.split("\n"):[classes];styles=styles.filter(function(style){return style});var result=styles.map(function(style){return" ${...tw`"+style.trim()+"`}"}).join("\n");console.log(result);macroArguments[1].node.quasis[0].value.raw="\n".concat(result,"\n")}}}else{console.error("Invalid call signature")}})}