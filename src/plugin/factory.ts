import { checkLayer } from "../utils/checkLayer";
import { getTailwindClasses } from "../utils/getTailwindClasses";
import { isIntrinsicElement } from "../utils/isIntrinsicElement";
import { stringToArray } from "../utils/stringToArray";
import { StyleController } from "./controller";
import { ProcessDeepClassesParams, emitter } from "./emitter";
import sass from "sass";
import { generateId } from "../utils/generateId";

export type DeepReference = {
  css: string;
  reference: string;
  identifier: string;
};

type GenerateClassTreeOptions = {
  reference: string;
  identifier?: string;
};

export type DeepStyleClass = {
  identifier: string;
  rawClasses: string;
  classes: StyleClass[];
};

type StyleClass = string | DeepStyleClass;
export class StyleFactory {
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
          classes: StyleFactory.separateClasses(classes),
        });
      }

      const hasComma = cur.endsWith(",");
      const haveBrackets = cur.includes("[") && cur.includes("]");

      const elementWihoutBrackets = haveBrackets ? cur.split("[")[0] : cur;
      const posibleElement = hasComma
        ? elementWihoutBrackets.replace(",", "")
        : elementWihoutBrackets;

      const specialOperators = ["+", ">", "~"];
      const specialDeclarationsCharacters = ["&", ...specialOperators];
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
        (isIntrinsicElement(posibleElement) || startWithSpecialCharacter)
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

    return result;
  }

  private static processStyles({
    filename,
    deepClass,
    stylePath,
  }: Omit<ProcessDeepClassesParams, "reference">) {
    const { reference, state: styleState } = emitter.register(
      filename,
      deepClass.rawClasses
    );

    const wasUpdated = styleState === "updated";

    if (!wasUpdated) {
      emitter.emit("process", {
        deepClass,
        filename,
        reference,
        stylePath,
      });
    } else {
      StyleController.keepCacheCycle(filename);
      emitter.checkStyles(stylePath);
    }

    return reference;
  }

  static formateStyleClasses(
    deepStyleClass: DeepStyleClass,
    filename: string,
    stylePath: string
  ) {
    const reference = StyleFactory.processStyles({
      deepClass: deepStyleClass,
      filename,
      stylePath,
    });

    return reference;
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
    { reference, identifier }: GenerateClassTreeOptions
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

      const css = await StyleFactory.generateClassTree(currentClass, {
        reference: componentReference,
        identifier: currentClass.identifier,
      });

      classes.push(componentReference);
      components.push({
        reference: componentReference,
        identifier: currentClass.identifier,
        css,
      });
    }

    const rawClasses = classes.join(" ");
    const res = await getTailwindClasses(
      `
      ${rawClasses}
    `,
      components
    );

    let formattedTailwindCss = res.css;

    classes.forEach((styleClass) => {
      const isString = typeof styleClass === "string";

      if (isString) {
        const classHasSeparator = /:/g.test(styleClass);
        const formattedStyleClass = classHasSeparator
          ? styleClass.replace(/:/g, "\\:")
          : styleClass;

        const component = components.find((component) => {
          return component.reference === formattedStyleClass;
        });

        const classIsDetected = formattedTailwindCss.includes(formattedStyleClass);
        const haveDot = formattedStyleClass.startsWith(".");

        const classReferAComponent = component && classIsDetected;
        const fromClass = `${haveDot ? "" : "."}${formattedStyleClass}`;
        const toReplace = "&";

        if (classReferAComponent) {
          return;
        }

        formattedTailwindCss = classIsDetected
          ? formattedTailwindCss.replace(fromClass, toReplace)
          : formattedTailwindCss;
      }
    });

    const blockReference = identifier ?? `.${reference}`;

    const specialOperators = ["+", "~", ">"];
    const specialOperator = specialOperators.find((operator) => {
      return blockReference.startsWith(operator);
    });

    if (specialOperator) {
      const { css: newCss, temporaryReference } = StyleFactory.addReferenceBeforeOperator(
        `${blockReference} {\n${formattedTailwindCss}\n}`,
        specialOperator
      );

      const compiledCss = sass.compileString(newCss);

      const finalCss = StyleFactory.removeReferenceBeforeOperator(
        compiledCss.css,
        temporaryReference,
        specialOperator
      );

      return finalCss;
    }

    const compiledCss = sass.compileString(
      `${blockReference} {\n${formattedTailwindCss}\n}`
    );

    return compiledCss.css;
  }
}
