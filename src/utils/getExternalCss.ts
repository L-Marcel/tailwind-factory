import sass from "sass";

export function getExternalCss(path: string) {
  const sassResult = sass.compile(path);
  let css = sassResult.css;

  const layerDeclarationsRegex =
    /(@tailwind base|@tailwind components|@tailwind utilities);?/g;

  if (layerDeclarationsRegex.test(css)) {
    css = css.replace(layerDeclarationsRegex, "");
  }

  return css;
}
