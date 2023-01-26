type VariantProps = {
  [key: string]: string;
};

type VariantStyles = {
  [Key in keyof VariantProps]: {
    [key: string]: string;
  };
};

export function removeWhiteSpaceInClasses(classes: string) {
  const whitespace = /(\r|\t)/g;
  const lineBreak = /(\n| )/g;
  let formattedClasses = classes;

  if (whitespace.test(formattedClasses)) {
    formattedClasses = formattedClasses.replace(whitespace, "");
  }

  if (lineBreak.test(formattedClasses)) {
    const allFormattedClasses = formattedClasses.split(lineBreak) as string[];
    try {
      return allFormattedClasses
        .filter((rawClass) => {
          rawClass = rawClass.trim();
          return !!rawClass && rawClass !== "\n";
        })
        .map((rawClass) => {
          //yes, is necessary...
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

  const _variantStyles = Object.entries(dynamicStyles).map(([key, values]) => {
    const variantStyle = values[props[key]];
    return removeWhiteSpaceInClasses(variantStyle);
  });

  const _styles = removeWhiteSpaceInClasses(styles);

  return `${_styles}${
    _variantStyles.length >= 1 && _styles ? " " : ""
  }${_variantStyles.join(" ")}`;
}
