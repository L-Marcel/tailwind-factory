import babel, { PluginObj } from '@babel/core';
import { Config } from 'tailwindcss';

type LogsMode = "none" | "all" | "normal" | "debug" | "errors";

type StandaloneOptions = {
    filename?: string;
    _reference?: string;
    config?: Promise<Config | undefined>;
};
type GenerateClassTreeOptions = {
    reference: string;
    identifier?: string;
    config?: Promise<Config | undefined>;
    inputStylePath?: string;
};
type DeepStyleClass$1 = {
    identifier: string;
    rawClasses: string;
    classes: StyleClass$1[];
};
type StyleClass$1 = string | DeepStyleClass$1;
declare class Standalone {
    static separateClasses(classes: string): StyleClass$1[];
    private static escapeSpecialCharacters;
    static addReferenceBeforeOperator(css: string, operator: string): {
        css: string;
        temporaryReference: string;
    };
    static removeReferenceBeforeOperator(css: string, reference: string, operator: string): string;
    static generateClassTree(deepClass: DeepStyleClass$1, filename: string, { reference, identifier, config, inputStylePath }: GenerateClassTreeOptions): Promise<string>;
    static run(raw: string, { _reference, filename, config }?: StandaloneOptions): Promise<{
        reference: string;
        css: string;
    }>;
}

type DeepStyleClass = {
    identifier: string;
    rawClasses: string;
    classes: StyleClass[];
};
type StyleClass = string | DeepStyleClass;
declare class StyleFactory {
    static generateClassTree: typeof Standalone.generateClassTree;
    private static processStyles;
    static formateStyleClasses(deepStyleClass: DeepStyleClass, filename: string, config: Promise<Config | undefined>, outputStylePath: string, inputStylePath: string, _reference?: string): string;
}

type PluginPreset = "react";
type PluginType = {
    preset?: PluginPreset;
    logs?: LogsMode;
    styles?: {
        outputPath?: string;
        inputPath?: string;
        config?: Promise<Config | undefined>;
    };
};
declare function export_default({ types: t }: typeof babel): PluginObj;

export { PluginPreset, PluginType, Standalone, StyleFactory, export_default as default };
