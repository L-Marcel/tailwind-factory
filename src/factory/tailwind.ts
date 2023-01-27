type VariantProps = {
  [key: string]: string | number | boolean;
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
    const params = Object.getOwnPropertyNames(values);
    let value = props[key];

    if (
      (params.includes("true") && Number(value) === 1) ||
      (params.includes("false") && Number(value) === 0)
    ) {
      value = Boolean(value);
    } else if (
      (params.includes("1") && Boolean(value) === true) ||
      (params.includes("0") && Boolean(value) === false)
    ) {
      value = Number(value);
    }

    const variantStyle = values[String(value)];
    return removeWhiteSpaceInClasses(variantStyle);
  });

  const _styles = removeWhiteSpaceInClasses(styles);

  return `${_styles}${
    _variantStyles.length >= 1 && _styles ? " " : ""
  }${_variantStyles.join(" ")}`;
}
