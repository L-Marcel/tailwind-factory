/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { NodePath, PluginObj, types } from "@babel/core";
import postcss from "postcss";
import tailwind from "tailwindcss";
import fs from "fs";
import { removeWhiteSpaceInClasses } from "./factory/tailwind";
import { EventEmitter } from "node:events";

type PluginType = {
  styles?: {
    path?: string;
  }
};

type StyleRegister = {
  filename: string;
  classes: string[];
};

const emitter = new EventEmitter();

emitter.on("register", (register: StyleRegister) => {
  console.log(register);
});

export default function({ types: t }: typeof babel): PluginObj {
  let imported = false;
  const keys = ["aasdfasd", "sadasdas"];
  let _id = 0;

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
          _id++;
          const id = _id;

          if(methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            const quasis = methodArguments[1].quasis[0];
            const reference = `factory__${keys[id]}`;

            postcss(tailwind({
              content: [
                {
                  raw: removeWhiteSpaceInClasses(quasis.value.raw)
                }
              ]
            })).process("@tailwind utilities;").then((res) => {

              const config: PluginType = state.opts;
              const stylesPath = config?.styles?.path;

              if(stylesPath) {
                fs.writeFile(stylesPath, res.css, (err) => {
                  if(err) {
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
      },
    }
  };
}