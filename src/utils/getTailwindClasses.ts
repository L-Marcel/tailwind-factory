import postcss from "postcss";
import tailwind from "tailwindcss";
import { DeepReference } from "../plugin/factory";

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

export async function getTailwindClasses(raw: string, components: DeepReference[] = []) {
  const result = await postcss(
    tailwind({
      corePlugins: {
        preflight: false,
      },
      content: [
        {
          raw,
        },
      ],
    })
  ).process(generateTailwindStylesFile(components), {
    from: undefined,
  });

  return result;
}
