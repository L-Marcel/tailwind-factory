/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { PluginObj, types } from "@babel/core";
import { removeWhiteSpaceInClasses } from "../factory/tailwind";
import { emitter } from "./emitter";
import path from "node:path";

import { StyleController } from "./controller";
import { Logs } from "./logs";
import { StyleFactory } from "./factory";
import { Validator } from "./validator";

type Properties = (types.ObjectMethod | types.ObjectProperty | types.SpreadElement)[];

export type PluginPreset = "react";

export type PluginType = {
  preset?: PluginPreset;
  styles?: {
    outputPath?: string;
    inputPath?: string;
    config?: string;
  };
};

let outputStylePath = path.resolve(__dirname, "styles.css");
let configPath = "../../tailwind.config.js";
let inputStylePath = "";//"../../src/styles/global.css";

export default function ({ types: t }: typeof babel): PluginObj {
  let imported = false;

  return {
    name: "tailwind-factory",
    pre: (state) => {
      console.warn = Logs.omitExpectedWarnings();
      Logs.info("generating styles");

      const filename = state.opts.filename ?? "";

      StyleController.isDev = state.opts.envName === "development";
      StyleController.startCacheCycle(filename);

      emitter.clearLoadedFile(filename);

      const watchedFiles = ["tailwind.config.js"];
      const watchedFile = watchedFiles.find(file => filename.endsWith(file));

      const isImportant = StyleController.isDev && watchedFile;

      if(isImportant) {
        Validator.validate(watchedFile, state.code);
      };
    },
    post: (state) => {
      if (imported) {
        const filename = state.opts.filename ?? "";
        emitter.setLoadedFile(filename, outputStylePath);
        console.log(filename);
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
          types.TemplateLiteral | types.StringLiteral,
          types.ObjectExpression
        ];

        if (
          imported &&
          (callee.type === "Identifier" || callee.type === "V8IntrinsicIdentifier") &&
          callee.name === "tf"
        ) {
          let methodStyleArgument = "";

          const config: PluginType = state.opts;
          const filename = state.filename ?? "";

          outputStylePath = config?.styles?.outputPath ?? outputStylePath;
          //inputStylePath = config?.styles?.inputPath ?? inputStylePath;
          configPath = config?.styles?.config ?? configPath;

          if (
            methodArguments.length >= 2 &&
            (t.isTemplateLiteral(methodArguments[1]) ||
              t.isStringLiteral(methodArguments[1]))
          ) {
            let rawClasses = "";

            if (t.isTemplateLiteral(methodArguments[1])) {
              const quasis = methodArguments[1].quasis[0];
              rawClasses = quasis.value.raw;
            } else {
              rawClasses = methodArguments[1].value;
            }

            const classes = removeWhiteSpaceInClasses(rawClasses);

            if (
              classes.split(" ").every((_class) => {
                return _class.startsWith("factory__");
              })
            ) {
              return;
            }

            const separatedClasses = StyleFactory.separateClasses(classes);

            const finalClass = StyleFactory.formateStyleClasses(
              {
                rawClasses: classes,
                classes: separatedClasses,
                identifier: "",
              },
              filename,
              configPath,
              outputStylePath,
              inputStylePath
            );

            methodStyleArgument = finalClass;
          }

          let methodOptions = methodArguments[2];
          if (methodArguments.length >= 3 && t.isObjectExpression(methodArguments[2])) {
            const optionsProperties = methodArguments[2].properties;

            const properties: Properties = [];

            optionsProperties.forEach((property, index) => {
              if (
                t.isObjectProperty(property) &&
                t.isIdentifier(property?.key) &&
                property?.key?.name === "variants" &&
                t.isObjectExpression(property?.value)
              ) {
                const variants = property.value.properties;
                const variantsProperties: Properties = [];

                variants.forEach((variant) => {
                  if (
                    t.isObjectProperty(variant) &&
                    t.isIdentifier(variant?.key) &&
                    variant?.key?.name &&
                    t.isObjectExpression(variant?.value)
                  ) {
                    const name = variant.key.name;
                    const values = variant.value.properties;

                    const variantValueProperties: Properties = [];

                    values.forEach((value) => {
                      if (
                        t.isObjectProperty(value) &&
                        t.isIdentifier(value?.key) &&
                        value?.key?.name &&
                        (t.isTemplateLiteral(value?.value) ||
                          t.isStringLiteral(value?.value))
                      ) {
                        const key = value?.key.name;
                        const baseReference = `${methodStyleArgument}_${name}_${key}`;

                        let valueRaw = "";

                        if (t.isTemplateLiteral(value?.value)) {
                          valueRaw = value?.value.quasis[0].value.raw;
                        } else {
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
                          outputStylePath,
                          inputStylePath,
                          baseReference
                        );

                        variantValueProperties.push(
                          t.objectProperty(
                            t.identifier(key),
                            t.templateLiteral(
                              [
                                t.templateElement({
                                  raw: finalVariantClass,
                                }),
                              ],
                              []
                            )
                          )
                        );
                      } else {
                        variantValueProperties.push(value);
                      }
                    });

                    variantsProperties.push(
                      t.objectProperty(
                        t.identifier(name),
                        t.objectExpression(variantValueProperties)
                      )
                    );
                  } else {
                    variantsProperties.push(variant);
                  }
                });

                properties.push(
                  t.objectProperty(
                    t.identifier("variants"),
                    t.objectExpression(variantsProperties)
                  )
                );
              } else {
                properties.push(property);
              }
            });

            methodOptions = t.objectExpression(properties);
          }

          path.replaceWith(
            t.callExpression(t.identifier("tf"), [
              methodArguments[0],
              t.templateLiteral(
                [
                  t.templateElement({
                    raw: methodStyleArgument,
                  }),
                ],
                []
              ),
              methodOptions,
            ])
          );
        }
      },
    },
  };
}
