/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { PluginObj, types } from "@babel/core";
import { removeWhiteSpaceInClasses } from "../factory/tailwind";
import { emitter } from "./emitter";
import path from "node:path";
import { Logs } from "./logs";

export type PluginPreset = "react" | "next";

export type PluginType = {
  preset?: PluginPreset;
  styles?: {
    path?: string;
  }
};

const defaultStylesPath = path.resolve(__dirname, "styles.css");

export default function({ types: t }: typeof babel): PluginObj {
  let imported = false;
  
  return {
    name: "tailwind-factory",
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;

        if(!imported && source === "tailwind-factory") {
          imported = true;
        }
      },
      CallExpression(path, state) {
        const callee = path.node.callee;
       
        const methodArguments = path.node.arguments as [
          any,
          types.TemplateLiteral,
          any
        ];

        if (
          imported && (callee.type === "Identifier" || callee.type === "V8IntrinsicIdentifier") && 
          callee.name === "tf"
        ) {
          if(methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            const quasis = methodArguments[1].quasis[0];
            const classes = removeWhiteSpaceInClasses(quasis.value.raw);
      
            if(classes) {
              const config: PluginType = state.opts;
              const stylePath = config?.styles?.path ?? defaultStylesPath;
              const preset = config?.preset ?? "react";

              Logs.changePreset(preset);

              const filename = state.filename ?? "";
              const { reference, state: styleState } = emitter.register(filename, classes);
              const wasUpdated = styleState === "updated";
              
              if(!wasUpdated) {
                emitter.emit("process", {
                  classes,
                  filename,
                  reference,
                  stylePath
                });
              } else {
                emitter.checkStyles(stylePath);
              }
              
              quasis.value.raw = reference;
            }
          }
        }
      },
    }
  };
}