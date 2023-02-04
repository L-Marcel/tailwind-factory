import { checkLayer } from "../utils/checkLayer";
import { generateId } from "../utils/generateId";
import { getTailwindClasses } from "../utils/getTailwindClasses";
import { isIntrinsicElement } from "../utils/isIntrinsicElement";
import { stringToArray } from "../utils/stringToArray";
import { StyleController } from "./controller";
import { ProcessDeepClassesParams, emitter } from "./emitter";
import sass from "sass";

export type DeepReference = {
  css: string;
  reference: string;
};

type GenerateClassTreeOptions = {
  reference: string;
  identifier?: string;
  main: boolean;
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
    { reference, identifier, main }: GenerateClassTreeOptions
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

      const css = await StyleFactory.generateClassTree(currentClass, {
        main: false,
        reference,
        identifier: currentClass.identifier,
      });

      classes.push(currentClass.identifier);
      components.push({
        reference: currentClass.identifier,
        css,
      });
    }

    const res = await getTailwindClasses(
      `
      ${deepClass.rawClasses}
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

        const classIsDetected = formattedTailwindCss.includes(formattedStyleClass);
        const haveDot = formattedStyleClass.startsWith(".");

        formattedTailwindCss = classIsDetected
          ? formattedTailwindCss.replace(
              `${haveDot ? "" : "."}${formattedStyleClass}`,
              "&"
            )
          : formattedTailwindCss;
      }
    });

    const compiledCss = sass.compileString(
      `${main ? `.${reference}` : identifier} {\n${formattedTailwindCss}\n}`
    );

    console.log(`${main ? `.${reference}` : identifier} {\n${formattedTailwindCss}\n}`);
    return compiledCss.css;
  }
}
