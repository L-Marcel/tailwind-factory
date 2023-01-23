import { FunctionComponent, JSXElementConstructor, ComponentProps, ReactElement } from 'react';

type FactoryElement = keyof JSX.IntrinsicElements | FunctionComponent | JSXElementConstructor<any>;
type FactoryExtractKeys<V> = {
    [Key in keyof V]?: keyof V[Key];
};
type StyledElementOptions<V, D, O> = {
    variants?: V;
    defaultVariants?: D & Partial<O>;
};
declare function tf<T extends FactoryElement, V, D, O extends FactoryExtractKeys<V>>(element: T, styles?: string, config?: StyledElementOptions<V, D, O>): (props: (T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : T extends infer X ? ComponentProps<T> : ComponentProps<T>) & (D extends infer C ? Partial<V extends infer U ? FactoryExtractKeys<U> : V> & Required<Omit<V extends infer U ? FactoryExtractKeys<U> : V, keyof C>> : V extends infer U ? FactoryExtractKeys<U> : V)) => ReactElement<{}, string | JSXElementConstructor<any>>;

export { FactoryElement, FactoryExtractKeys, StyledElementOptions, tf };
