import { JSXElementConstructor, ComponentProps } from 'react';

type BooleanString = "true" | "false";
type ValueType<B> = B extends BooleanString ? boolean | BooleanString : B;
type FactoryExtractKeys<V> = {
    [Key in keyof V]?: ValueType<keyof V[Key]>;
};
type FactoryExtractRequiredKeysAndValues<V> = {
    [Key in keyof V]: {
        [Property in keyof V[Key]]: string;
    };
};
type FactoryExtractKeysAndValues<V> = {
    [Key in keyof V]?: {
        [Property in keyof V[Key]]?: string;
    };
};
type StyledElementOptions<V, D, O> = {
    variants?: V;
    defaultVariants?: D & Partial<O>;
};
type FactoryElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
declare function tf<Type extends FactoryElement, StyleVariants, DefaultStyleVariants, DefaultStyleVariantsScheme extends FactoryExtractKeys<StyleVariants>>(element: Type, styles?: string, config?: StyledElementOptions<StyleVariants, DefaultStyleVariants, DefaultStyleVariantsScheme>): ((props: ComponentProps<Type> & (DefaultStyleVariants extends infer C ? Partial<StyleVariants extends infer U ? FactoryExtractKeys<U> : any> & Required<Omit<StyleVariants extends infer U ? FactoryExtractKeys<U> : any, keyof C>> : StyleVariants extends infer U ? FactoryExtractKeys<U> : any)) => JSX.Element) & {
    extends: <NewStyleVariants, NewDefaultStyleVariants, NewDefaultStyleVariantsScheme extends FactoryExtractKeys<FactoryExtractRequiredKeysAndValues<StyleVariants> & NewStyleVariants>>(newStyles?: string, newConfig?: StyledElementOptions<NewStyleVariants & FactoryExtractKeysAndValues<StyleVariants>, NewDefaultStyleVariants, NewDefaultStyleVariantsScheme>) => ((props: ComponentProps<Type> & (NewDefaultStyleVariants extends infer C_1 ? DefaultStyleVariants extends infer O ? Partial<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any> & Required<Omit<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any, keyof O | keyof C_1>> : Partial<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any> & Required<Omit<StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any, keyof C_1>> : StyleVariants & NewStyleVariants extends infer U_1 ? FactoryExtractKeys<U_1> : any)) => JSX.Element) & {
        extends: any;
    };
};

export { FactoryElement, FactoryExtractKeys, FactoryExtractKeysAndValues, FactoryExtractRequiredKeysAndValues, StyledElementOptions, tf };
