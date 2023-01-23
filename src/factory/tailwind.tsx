type VariantProps = {
  [key: string]: string;
};

type VariantStyles = {
  [Key in keyof VariantProps]: {
    [key: string]: string;
  };
};

export function removeWhiteSpaceInClasses(classes: string) {
  const whitespace = /(\r|\t| )/g;
  const lineBreak = /(\n)/g;
  let formattedClasses = classes;

  if (whitespace.test(formattedClasses)) {
    formattedClasses = formattedClasses.replace(whitespace, "");
  }

  if (lineBreak.test(formattedClasses)) {
    const allFormattedClasses = formattedClasses.split(lineBreak) as string[];
    try {
      return allFormattedClasses
        .filter((rawClass) => {
          return !!rawClass && rawClass !== "\n";
        })
        .map((rawClass, i) => {
          return rawClass.trim();
        })
        .join(" ");
    } catch {
      return "";
    }
  }

  return formattedClasses;
}

export function getStyledElementClassName<V, S>(
  styles: string,
  variantProps: V,
  variantStyles: S
): string {
  const props = variantProps as VariantProps;
  const dynamicStyles = variantStyles as VariantStyles;

  const _styles = `${
    styles ? `${removeWhiteSpaceInClasses(styles)} ` : ""
  }${Object.entries(dynamicStyles)
    .map(([key, values]) => {
      const variantStyle = values[props[key]];
      return removeWhiteSpaceInClasses(variantStyle);
    })
    .join(" ")}`;

  return _styles;
}
