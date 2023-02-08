/* eslint-disable @typescript-eslint/no-explicit-any */

import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { DeepReference } from "../plugin/factory";
import { FactoryConfig } from "../plugin/config";
import { getExternalCss } from "./getExternalCss";
import { stringArrayToBoolean } from "./stringArrayToBoolean";

type TailwindGenerateClassesParams = {
  components: DeepReference[];
  inputStylePath?: string;
  config?: Promise<Config | undefined>;
};

function generateTailwindStylesFile(components: DeepReference[] = [], externalCss = "") {
  const haveComponents = components.length >= 1;

  if (!haveComponents) {
    return `
@tailwind utilities;
@tailwind components;

@layer components {
  ${externalCss}
}
`;
  }

  const componentsCss = components
    .map(({ reference, css, isPseudoClass }) => {
      return isPseudoClass? `.${reference}${css}`:`.${reference} {\n${css}\n}`;
    })
    .join("\n");

  return `
@tailwind utilities;
@tailwind components;

@layer components {
  ${externalCss}
  ${componentsCss}
}
`;
}

export async function getTailwindClasses(
  raw: string,
  { components, inputStylePath, config }: TailwindGenerateClassesParams
) {
  let tailwindConfig: Config = {
    corePlugins: {
      preflight: false,
    },
    content: [
      {
        raw,
      },
    ],
  };

  let externalCss = "";
  if (inputStylePath) {
    externalCss = getExternalCss(inputStylePath);
  }

  if (config) {
    const newConfig = await FactoryConfig.getTailwindConfig(config);

    const corePlugins = Array.isArray(newConfig?.corePlugins)
      ? stringArrayToBoolean(newConfig?.corePlugins as any[])
      : {};

    tailwindConfig = {
      ...newConfig,
      ...tailwindConfig,
      corePlugins: {
        ...corePlugins,
        preflight: false,
      },
    };
  }

  const result = await postcss(tailwind(tailwindConfig)).process(
    generateTailwindStylesFile(components, externalCss),
    {
      from: undefined,
    }
  );

  return result;
}
