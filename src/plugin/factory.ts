import { StyleController } from "./controller";
import { ProcessDeepClassesParams, emitter } from "./emitter";
import { Config } from "tailwindcss";
import { Standalone } from "./standalone";

export type DeepReference = {
  css: string;
  reference: string;
  identifier: string;
  isPseudoClass: boolean;
};

export type DeepStyleClass = {
  identifier: string;
  rawClasses: string;
  classes: StyleClass[];
};

type StyleClass = string | DeepStyleClass;
export class StyleFactory {
  static generateClassTree = Standalone.generateClassTree;
  
  private static processStyles(
    {
      filename,
      deepClass,
      outputStylePath,
      inputStylePath,
      config,
    }: Omit<ProcessDeepClassesParams, "reference">,
    _reference?: string
  ) {
    const { reference, state: styleState } = emitter.register(
      filename,
      deepClass.rawClasses,
      _reference
    );

    const wasUpdated = styleState === "updated";

    if (!wasUpdated) {
      emitter.emit("process", {
        deepClass,
        filename,
        config,
        reference,
        outputStylePath,
        inputStylePath,
      });
    } else {
      StyleController.keepCacheCycle(filename);
      emitter.checkStyles(outputStylePath);
    }

    return reference;
  }

  static formateStyleClasses(
    deepStyleClass: DeepStyleClass,
    filename: string,
    config: Promise<Config | undefined>,
    outputStylePath: string,
    inputStylePath: string,
    _reference?: string
  ) {
    const reference = StyleFactory.processStyles(
      {
        deepClass: deepStyleClass,
        filename,
        outputStylePath,
        inputStylePath,
        config,
      },
      _reference
    );

    return reference;
  }
}
