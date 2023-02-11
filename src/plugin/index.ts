/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import babel, { PluginObj, types } from "@babel/core";
import { removeWhiteSpaceInClasses } from "../factory/tailwind";
import { emitter } from "./emitter";

import { StyleController } from "./controller";
import { Logs, LogsMode } from "./logs";
import { StyleFactory } from "./factory";
import { Validator } from "./validator";
import { Config } from "tailwindcss";
import { Standalone } from "./standalone";

type Properties = (types.ObjectMethod | types.ObjectProperty | types.SpreadElement)[];

export type PluginPreset = "react";

export type PluginType = {
  preset?: PluginPreset;
  logs?: LogsMode;
  styles?: {
    outputPath?: string;
    inputPath?: string;
    config?: Promise<Config | undefined>;
  };
};

const watchedFiles = ["tailwind.config.js"];

let outputStylePath = "src/styles/generated.css";
let tailwindConfig: Promise<Config | undefined>;

//disabled
const inputStylePath = ""; //"../../src/styles/global.css";

let config: PluginType = {};
export default function ({ types: t }: typeof babel): PluginObj {
  let imported = false;

  return {
    name: "tailwind-factory",
    pre(state) {
      config = this.opts;
      Logs.init(config.logs ?? "errors");

      console.warn = Logs.omitExpectedWarnings();
      console.error = Logs.omitUncaughtException();

      Logs.info("generating styles...");

      const filename = state.opts.filename ?? "";

      StyleController.isDev = state.opts.envName === "development";
      StyleController.startCacheCycle(filename);

      emitter.clearLoadedFile(filename);

      const watchedFile = watchedFiles.find((file) => {
        return filename.endsWith(file);
      });

      const isImportant = StyleController.isDev && watchedFile;

      if (isImportant) {
        Validator.validate(watchedFile, state.code);
      }
    },
    post(state) {
      if (imported) {
        const filename = state.opts.filename ?? "";
        emitter.setLoadedFile(filename, outputStylePath);
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

        const newMethodArguments: (
          | types.ArgumentPlaceholder
          | types.JSXNamespacedName
          | types.SpreadElement
          | babel.types.Expression
        )[] = [methodArguments[0]];

        if (
          (imported &&
            (t.isIdentifier(callee) || t.isV8IntrinsicIdentifier(callee)) &&
            callee.name === "tf") ||
          (t.isMemberExpression(callee) &&
            (t.isIdentifier(callee.object) || t.isV8IntrinsicIdentifier(callee.object)) &&
            (t.isIdentifier(callee.property) ||
              t.isV8IntrinsicIdentifier(callee.property)) &&
            callee.property.name === "__extends")
        ) {
          imported = true;

          outputStylePath = config?.styles?.outputPath ?? outputStylePath;
          //inputStylePath = config?.styles?.inputPath ?? inputStylePath;
          tailwindConfig = config?.styles?.config ?? tailwindConfig;

          const filename = state.filename ?? "";

          let methodStyleArgument = "";

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
            const separatedClasses = Standalone.separateClasses(classes);

            const finalClass = StyleFactory.formatStyleClasses(
              {
                rawClasses: classes,
                classes: separatedClasses,
                identifier: "",
              },
              filename,
              tailwindConfig,
              outputStylePath,
              inputStylePath
            );

            methodStyleArgument = finalClass;
            newMethodArguments.push(
              t.templateLiteral(
                [
                  t.templateElement({
                    raw: finalClass,
                  }),
                ],
                []
              )
            );
          }

          if (methodArguments.length >= 3 && t.isObjectExpression(methodArguments[2])) {
            let methodOptions = methodArguments[2];
            const optionsProperties = methodArguments[2].properties;

            const properties: Properties = [];

            optionsProperties.forEach((property) => {
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

                        const separatedClasses = Standalone.separateClasses(classes);
                        const finalVariantClass = StyleFactory.formatStyleClasses(
                          {
                            rawClasses: classes,
                            classes: separatedClasses,
                            identifier: "",
                          },
                          filename,
                          tailwindConfig,
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
            newMethodArguments.push(methodOptions);
          }

          const isExpression = t.isMemberExpression(callee);
          const objectName =
            isExpression &&
            (t.isIdentifier(callee.object) || t.isV8IntrinsicIdentifier(callee.object))
              ? callee.object.name
              : "";

          const callExpressionContent = isExpression
            ? t.memberExpression(t.identifier(objectName), t.identifier("__extends"))
            : t.identifier("tf");

          path.replaceWith(t.callExpression(callExpressionContent, newMethodArguments));

          path.skip();
        }
      },
    },
  };
}

export { StyleFactory, Standalone };
