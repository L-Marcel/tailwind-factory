/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { PluginObj, types } from "@babel/core";
import { removeWhiteSpaceInClasses } from "../factory/tailwind";
import { emitter } from "./emitter";
import path from "node:path";

import { StyleController } from "./controller";
import { Logs } from "./logs";
import { StyleFactory } from "./factory";

export type PluginPreset = "react";

export type PluginType = {
  preset?: PluginPreset;
  styles?: {
    path?: string;
    config?: string;
  };
};

let stylePath = path.resolve(__dirname, "styles.css");
let configPath = "../../tailwind.config.js";

export default function ({ types: t }: typeof babel): PluginObj {
  let imported = false;

  return {
    name: "tailwind-factory",
    pre: (state) => {
      Logs.info("generating styles");

      const filename = state.opts.filename ?? "";

      StyleController.isDev = state.opts.envName === "development";
      StyleController.startCacheCycle(filename);

      emitter.clearLoadedFile(filename);
    },
    post: (state) => {
      if (imported) {
        const filename = state.opts.filename ?? "";
        emitter.setLoadedFile(filename, stylePath);
      }
    },
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value;

        if (!imported && source === "tailwind-factory") {
          imported = true;
        }
      },
      CallExpression(path, state) {
        const callee = path.node.callee;
        const methodArguments = path.node.arguments as [
          any,
          types.TemplateLiteral,
          types.ObjectExpression
        ];

        if (
          imported &&
          (callee.type === "Identifier" || callee.type === "V8IntrinsicIdentifier") &&
          callee.name === "tf"
        ) {
          let componentReference = "";

          const config: PluginType = state.opts;
          const filename = state.filename ?? "";

          stylePath = config?.styles?.path ?? stylePath;
          configPath = config?.styles?.config ?? configPath;

          if (methodArguments.length >= 2 && t.isTemplateLiteral(methodArguments[1])) {
            const quasis = methodArguments[1].quasis[0];
            const classes = removeWhiteSpaceInClasses(quasis.value.raw);

            const separatedClasses = StyleFactory.separateClasses(classes);
            const finalClass = StyleFactory.formateStyleClasses(
              {
                rawClasses: classes,
                classes: separatedClasses,
                identifier: "",
              },
              filename,
              configPath,
              stylePath
            );

            componentReference = finalClass;
            quasis.value.raw = finalClass;
          }

          if (methodArguments.length >= 3 && t.isObjectExpression(methodArguments[2])) {
            const optionsProperties = methodArguments[2].properties;

            optionsProperties.forEach((property) => {
              if (
                t.isObjectProperty(property) &&
                t.isIdentifier(property?.key) &&
                property?.key?.name === "variants" &&
                t.isObjectExpression(property?.value)
              ) {
                const variants = property.value.properties;

                variants.forEach((variant) => {
                  if (
                    t.isObjectProperty(variant) &&
                    t.isIdentifier(variant?.key) &&
                    variant?.key?.name &&
                    t.isObjectExpression(variant?.value)
                  ) {
                    const name = variant.key.name;
                    const values = variant.value.properties;

                    values.forEach((value) => {
                      if (
                        t.isObjectProperty(value) &&
                        t.isIdentifier(value?.key) &&
                        value?.key?.name
                      ) {
                        const key = value?.key.name;
                        const baseReference = `${componentReference}_${name}_${key}`;

                        let valueRaw = "";

                        if (t.isTemplateLiteral(value?.value)) {
                          valueRaw = value?.value.quasis[0].value.raw;
                        } else if (t.isStringLiteral(value?.value)) {
                          valueRaw = value?.value.value;
                        }

                        const classes = removeWhiteSpaceInClasses(valueRaw);

                        const separatedClasses = StyleFactory.separateClasses(classes);
                        const finalVariantClass = StyleFactory.formateStyleClasses(
                          {
                            rawClasses: classes,
                            classes: separatedClasses,
                            identifier: "",
                          },
                          filename,
                          configPath,
                          stylePath,
                          baseReference
                        );

                        if (t.isTemplateLiteral(value?.value)) {
                          const quasis = value?.value.quasis[0];
                          quasis.value.raw = finalVariantClass;
                        } else if (t.isStringLiteral(value?.value)) {
                          const _variant = value?.value;
                          _variant.value = finalVariantClass;
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        }
      },
    },
  };
}
