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
      const specialCharacters = [".", "#", "*", ":", "&"];
      const specialOperators = ["+", ">"];

      const isAnOperator = specialOperators.includes(cur);

      const startWithSpecialCharacter = specialCharacters.some((specialCharacter) => {
        return cur.startsWith(specialCharacter);
      });

      const nextElementIsKey =
        (index < list.length - 1 && list[index + 1] === "{") || hasComma;

      if (
        !canBeABlock &&
        nextElementIsKey &&
        (isIntrinsicElement(cur) || startWithSpecialCharacter)
      ) {
        blockContent = [];
        canBeABlock = true;
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
    styleClasses: StyleClass[],
    filename: string,
    stylePath: string
  ) {
    return styleClasses
      .reduce((prev, styleClass) => {
        const isString = typeof styleClass === "string";

        if (isString) {
          prev.push(styleClass);
          return prev;
        }

        const reference = StyleFactory.processStyles({
          deepClass: styleClass,
          filename,
          stylePath,
        });

        prev.push(reference);
        return prev;
      }, [] as string[])
      .join(" ");
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

    const compiledCss = sass.compileString(
      `${blockReference} {\n${formattedTailwindCss}\n}`
    );

    return compiledCss.css;
  }
}
