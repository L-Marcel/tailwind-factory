/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { NodePath, PluginObj, types } from "@babel/core";
import postcss from "postcss";
import tailwind from "tailwindcss";
import fs from "fs";
import { resolve } from "path";
import { removeWhiteSpaceInClasses } from "./factory/tailwind";

type PluginType = {
  styles?: {
    path?: string;
  }
};

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
          NodePath<types.TemplateLiteral>,
          any
        ];

        if (
          imported && (callee.type === "Identifier" || callee.type === "V8IntrinsicIdentifier") && 
          callee.name === "tf"
        ) {
          console.log(callee.start, " - Factory called!");

          if(methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            const quasis = methodArguments[1].quasis[0];
            postcss(tailwind({
              content: [
                {
                  raw: removeWhiteSpaceInClasses(quasis.value.raw)
                }
              ]
            })).process("@tailwind utilities;").then((res) => {
              const config: PluginType = state.opts;
              const stylesPath = config?.styles?.path;

              //res.css -> tailwind generate styles
              console.log("Tailwind styles: ", res.css);
              if(stylesPath) {
                fs.writeFile(stylesPath, ".test { background: red; }", (err) => {
                  if(err) {
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
      },
    }
  };
}