import { Config } from "tailwindcss";
import { removeWhiteSpaceInClasses } from "../factory/tailwind";
import { generateId } from "../utils/generateId";
import { stringToArray } from "../utils/stringToArray";
import { checkLayer } from "../utils/checkLayer";
import { isIntrinsicElement } from "../utils/isIntrinsicElement";
import { getTailwindClasses } from "../utils/getTailwindClasses";
import { Logs } from "./logs";
import { StyleError } from "./errors/StyleError";
import sass from "sass";

export type StandaloneOptions = {
  filename?: string;
  _reference?: string;
  config?: Promise<Config | undefined>;
};

export type DeepReference = {
  css: string;
  reference: string;
  identifier: string;
  isPseudoClass: boolean;
};

type GenerateClassTreeOptions = {
  reference: string;
  identifier?: string;
  config?: Promise<Config | undefined>;
  inputStylePath?: string;
};

export type DeepStyleClass = {
  identifier: string;
  rawClasses: string;
  classes: StyleClass[];
};

type StyleClass = string | DeepStyleClass;

export class Standalone {
  static separateClasses(classes: string) {
    const mapOfClasses = stringToArray(classes);
  
    let layer = 0;
    let blockType: string[] = [];
    let blockContent: string[] = [];
    let canBeABlock = false;
    let isInsideBlock = false;
    const result = mapOfClasses.reduce((prev, cur, index, list) => {
      const [isStillInsideBlock, currentLayer] = checkLayer(isInsideBlock, layer, cur);
      isInsideBlock = isStillInsideBlock;
      layer = currentLayer;
  
      if (isInsideBlock) {
        blockContent.push(cur);
        return prev;
      } else if (!isInsideBlock && canBeABlock && cur === "}") {
        canBeABlock = false;
  
        blockContent.shift();
        const classes = blockContent.join(" ");
  
        prev.push({
          identifier: blockType.join(" "),
          rawClasses: classes,
          classes: Standalone.separateClasses(classes),
        });
      }
  
      const hasComma = cur.endsWith(",");
      const haveBrackets = cur.includes("[") && cur.includes("]");
      const haveColorInside = !cur.startsWith(":") && cur.includes(":");
      const afterPseudoClass = haveColorInside? cur.split(":")[0]:cur;

      const elementWihoutBrackets = haveBrackets ? afterPseudoClass.split("[")[0] : afterPseudoClass;
      const possibleElement = hasComma
        ? elementWihoutBrackets.replace(",", "")
        : elementWihoutBrackets;
  
      const specialOperators = ["+", ">", "~"];
      const specialDeclarationsCharacters = ["&", "@media", ...specialOperators];
      const specialCharacters = [".", "#", "*", ":", ...specialDeclarationsCharacters];
  
      const isAnOperator = specialOperators.includes(cur);
      const isASpecialDeclarationCharacter = specialDeclarationsCharacters.includes(cur);
  
      const startWithSpecialCharacter = specialCharacters.some((specialCharacter) => {
        return cur.startsWith(specialCharacter);
      });
  
      const nextElementIsKey =
        (index < list.length - 1 && list[index + 1] === "{") || hasComma;
  
      const nextElementIsAnOperator =
        index < list.length - 1 && specialOperators.includes(list[index + 1]);
  
      if (
        !canBeABlock &&
        (nextElementIsKey || nextElementIsAnOperator || isASpecialDeclarationCharacter) &&
        (isIntrinsicElement(possibleElement) || startWithSpecialCharacter)
      ) {
        blockContent = [];
        canBeABlock = true;
  
        if (nextElementIsAnOperator) {
          const nextElement = list[index + 1];
          const nextElementIsAnArrow = nextElement === ">";
  
          if (cur === "&" && nextElementIsAnArrow) {
            return prev;
          }
        }
  
        blockType = [cur];
        return prev;
      } else if (canBeABlock && !isInsideBlock && (nextElementIsKey || isAnOperator)) {
        blockType.push(cur);
        return prev;
      }
  
      if (
        !canBeABlock &&
        !isInsideBlock &&
        !isIntrinsicElement(cur) &&
        !startWithSpecialCharacter &&
        !cur.endsWith("}") &&
        !nextElementIsKey
      ) {
        prev.push(cur);
      }
  
      return prev;
    }, [] as StyleClass[]);
  
    Logs.debug("on separate: ", result);
    return result;
  }

  private static escapeSpecialCharacters(value: string) {
    const escapedsSecialCharacters = [
      ":",
      "\\[",
      "\\]",
      "#",
      "\\/",
      "\\+",
      "\\(",
      "\\)",
      "%",
      "\\*",
      ","
    ];

    //who invented this?
    const replaceValues = [
      "\\\\:",
      "\\\\\\[",
      "\\\\\\]",
      "\\\\#",
      "\\\\\\/",
      "\\\\\\+",
      "\\\\\\(",
      "\\\\\\)",
      "\\\\%",
      "\\\\\\*",
      "\\\\2c"
    ];

    if(!value.startsWith(".") && value.includes(".")) {
      value = value.replace(/\./g, "\\\\.");
    };

    replaceValues.forEach((replace, index) => {
      const escapedCharacter = escapedsSecialCharacters[index];
      const characterRegex = new RegExp(escapedCharacter, "g");

      if (characterRegex.test(value)) {
        value = value.replace(characterRegex, `${replace}`);
      }
    });

    if(value.startsWith("2xl")) {
      value = value.replace(/2xl/g, "\\\\32xl");
    };

    return value;
  }
  
  
  static addReferenceBeforeOperator(css: string, operator: string) {
    const id = generateId();
    const temporaryReference = `.__prevent_deprecation_${id}`;

    if (!css.includes("{")) {
      return {
        css,
        temporaryReference,
      };
    }

    const [declaration, ...rest] = css.split("{");

    const operatorRegex = new RegExp(operator, "g");

    const newDeclaration = declaration.replace(
      operatorRegex,
      `${temporaryReference} ${operator}`
    );

    const newCss = [newDeclaration, ...rest].join("{");

    return {
      css: newCss,
      temporaryReference,
    };
  }

  static removeReferenceBeforeOperator(css: string, reference: string, operator: string) {
    if (!css.includes(reference)) {
      return css;
    }

    const referenceRegex = new RegExp(`${reference} ${operator}`, "g");
    const newCss = css.replace(referenceRegex, operator);

    return newCss;
  }

  static async generateClassTree(
    deepClass: DeepStyleClass,
    filename: string,
    { reference, identifier, config, inputStylePath }: GenerateClassTreeOptions
  ) {
    const classes: string[] = [];
    const components: DeepReference[] = [];

    for (const c in deepClass.classes) {
      const currentClass = deepClass.classes[c];
      const isString = typeof currentClass === "string";

      if (isString) {
        classes.push(currentClass);
        continue;
      }

      const id = generateId();
      const componentReference = `deep_${id}`;

      const css = await Standalone.generateClassTree(currentClass, filename, {
        config,
        reference: componentReference,
        identifier: currentClass.identifier,
        inputStylePath,
      });

      let isPseudoClass = false;
      if(currentClass.identifier.startsWith(":")) {
        isPseudoClass = true;
      };

      classes.push(componentReference);
      components.push({
        reference: componentReference,
        identifier: currentClass.identifier,
        isPseudoClass,
        css,
      });
    }

    const rawClasses = classes.join(" ");
    const res = await getTailwindClasses(
      `
      ${rawClasses}
    `,
      {
        components,
        config,
        inputStylePath,
      }
    );

    let formattedTailwindCss = res.css;

    Logs.debug(`components: `, components, '\n');

    classes.sort((a, b) => a.length > b.length? 1:-1).forEach((styleClass, index) => {
      const formattedStyleClass = Standalone.escapeSpecialCharacters(styleClass);

      const haveDot = formattedStyleClass.startsWith(".");
      const fromClass = `${haveDot? "" : "\\."}${formattedStyleClass}`;
      const toReplace = "&";

      const asComponent = components.find(component => component.reference === styleClass);

      let classRegex = new RegExp(`${fromClass}${asComponent?.isPseudoClass? ``:`(?=.*? )`}`, "g");
      const classIsDetected = classRegex.test(formattedTailwindCss);

      Logs.debug(`${index + 1}º`, classIsDetected, classRegex, fromClass, haveDot);
      if(asComponent?.isPseudoClass) {
        Logs.debug(`pseudo: `, formattedTailwindCss);
      };

      formattedTailwindCss = classIsDetected
        ? formattedTailwindCss.replace(classRegex, toReplace)
        : formattedTailwindCss;
    });

    const blockReference = identifier ?? `.${reference}`;

    const isMedia = blockReference.startsWith("@media");

    if(isMedia) {
      try {
        const compiledCss = sass.compileString(
          `.${reference} {\n${blockReference} {\n${formattedTailwindCss}\n}\n}`
        );

        Logs.debug(`css: `, compiledCss.css, "\n");
        return compiledCss.css;
      } catch (error: any) {
        const _error = new StyleError(error?.message ?? "", filename, error?.stack ?? error?.message);
        Logs.error(_error.message);
        return "";
      }
    };

    const specialOperators = ["+", "~", ">"];
    const specialOperator = specialOperators.find((operator) => {
      return blockReference.startsWith(operator);
    });

    if (specialOperator) {
      const { css: newCss, temporaryReference } = Standalone.addReferenceBeforeOperator(
        `${blockReference} {\n${formattedTailwindCss}\n}`,
        specialOperator
      );

      try {
        const compiledCss = sass.compileString(newCss);

        const finalCss = Standalone.removeReferenceBeforeOperator(
          compiledCss.css,
          temporaryReference,
          specialOperator
        );
  
        Logs.debug(`css: `, finalCss, "\n");
        return finalCss;
      } catch (error: any) {
        const _error = new StyleError(error?.message ?? "", filename, error?.stack ?? error?.message);
        Logs.error(_error.message);
        return "";
      }
    }

    Logs.debug("css before compile: ", formattedTailwindCss);
    try {
      const compiledCss = sass.compileString(
        `${blockReference} {\n${formattedTailwindCss}\n}`
      );
  
      Logs.debug(`css: `, compiledCss.css, "\n");
      return compiledCss.css;
    } catch (error: any) {
      const _error = new StyleError(error?.message ?? "", filename, error?.stack ?? error?.message);
      Logs.error(_error.message);
      return "";
    }
  }

  static async run(raw: string, { _reference, filename, config }: StandaloneOptions = {
    filename: "standalone"
  }) {
    const classes = removeWhiteSpaceInClasses(raw);
    const separatedClasses = Standalone.separateClasses(classes);
  
    const id = generateId();
    const reference = _reference ?? `factory__${id}`;
    const css = await Standalone.generateClassTree({
      rawClasses: classes,
      classes: separatedClasses,
      identifier: "",
    }, filename ?? "standalone.ts", {
      reference,
      config
    });
  
    return { reference, css };
  };
}