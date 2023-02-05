import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { DeepReference } from "../plugin/factory";
import { FactoryConfig } from "../plugin/config";
import { Logs } from "../plugin/logs";

function generateTailwindStylesFile(components: DeepReference[] = []) {
  const haveComponents = components.length >= 1;

  if (!haveComponents) {
    return `
@tailwind utilities;
@tailwind components;
    `;
  }

  const componentsCss = components
    .map(({ css }) => {
      return css;
    })
    .join("\n");

  return `
@tailwind utilities;
@tailwind components;
@layer components {
  ${componentsCss}
}
  `;
}

export async function getTailwindClasses(
  raw: string,
  components: DeepReference[] = [],
  configPath?: string
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

  if (configPath) {
    const config = await FactoryConfig.getTailwindConfig(configPath);
    tailwindConfig = {
      ...config,
      ...tailwindConfig,

      corePlugins: {
        preflight: false,
      },
    };
  }

  const result = await postcss(tailwind(tailwindConfig)).process(
    generateTailwindStylesFile(components),
    {
      from: undefined,
    }
  );

  return result;
}
