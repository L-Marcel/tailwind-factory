import { Config } from 'tailwindcss';

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
type DeepStyleClass = {
    identifier: string;
    rawClasses: string;
    classes: StyleClass[];
};
type StyleClass = string | DeepStyleClass;
declare class Standalone {
    static separateClasses(classes: string): StyleClass[];
    private static escapeSpecialCharacters;
    static addReferenceBeforeOperator(css: string, operator: string): {
        css: string;
        temporaryReference: string;
    };
    static removeReferenceBeforeOperator(css: string, reference: string, operator: string): string;
    static generateClassTree(deepClass: DeepStyleClass, filename: string, { reference, identifier, config, inputStylePath }: GenerateClassTreeOptions): Promise<string>;
    static run(raw: string, { _reference, filename, config }?: StandaloneOptions): Promise<{
        reference: string;
        css: string;
    }>;
}

export { Standalone as S };
