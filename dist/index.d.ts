import { ComponentProps, JSXElementConstructor } from "react";
import { removeWhiteSpaceInClasses } from "./factory/tailwind";
type BooleanString = "true" | "false";
type ValueType<B> = B extends BooleanString ? boolean | BooleanString : B;
export type FactoryExtractKeys<V> = {
    [Key in keyof V]?: ValueType<keyof V[Key]>;
};
export type FactoryExtractRequiredKeysAndValues<V> = {
    [Key in keyof V]: {
        [Property in keyof V[Key]]: string;
    };
};
export type FactoryExtractKeysAndValues<V> = {
    [Key in keyof V]?: {
        [Property in keyof V[Key]]?: string;
    };
};
export type StyledElementOptions<V, D, O> = {
    variants?: V;
    defaultVariants?: D & Partial<O>;
    mode?: "legacy";
};
export type FactoryElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
export type FactoryStyles = {
    [key: string]: number | string | FactoryStyles;
};
export declare function tf<Type extends FactoryElement, StyleVariants, DefaultStyleVariants, DefaultStyleVariantsScheme extends FactoryExtractKeys<StyleVariants>>(element: Type, styles?: FactoryStyles | string, config?: StyledElementOptions<StyleVariants, DefaultStyleVariants, DefaultStyleVariantsScheme>): ((props: ComponentProps<Type> & (DefaultStyleVariants extends infer C ? Partial<StyleVariants extends infer U ? FactoryExtractKeys<U> : any> & Required<Omit<StyleVariants extends infer U ? FactoryExtractKeys<U> : any, keyof C>> : StyleVariants extends infer U ? FactoryExtractKeys<U> : any)) => JSX.Element) & {
    extends: <NewType extends FactoryElement | null, NewStyleVariants, NewDefaultStyleVariants, NewDefaultStyleVariantsScheme extends FactoryExtractKeys<FactoryExtractRequiredKeysAndValues<StyleVariants> & NewStyleVariants>>(newElement?: NewType | undefined, newStyles?: string, newConfig?: StyledElementOptions<NewStyleVariants & FactoryExtractKeysAndValues<StyleVariants>, NewDefaultStyleVariants, NewDefaultStyleVariantsScheme>) => ((props: (NewType extends FactoryElement ? ComponentProps<NewType> : ComponentProps<Type>) & (NewDefaultStyleVariants extends infer C_1 ? DefaultStyleVariants extends infer O ? Partial<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any> & Required<Omit<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any, keyof O | keyof C_1>> : Partial<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any> & Required<Omit<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any, keyof C_1>> : StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any)) => JSX.Element) & {
        extends: any;
    };
};
export { removeWhiteSpaceInClasses };
//# sourceMappingURL=index.d.ts.map