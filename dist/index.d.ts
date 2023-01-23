import * as react from 'react';
import { JSXElementConstructor, ComponentProps, FunctionComponent } from 'react';

type StyledElementOptions<V, D> = {
    variants?: V;
    defaultVariants?: D;
};
declare function tf<T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>, V, D extends {
    [Key in keyof V]?: keyof V[Key];
}>(element: T, styles?: string, config?: StyledElementOptions<V, D>): {
    (props: ComponentProps<T> & (D extends infer C ? (V extends infer U ? { [Key in keyof U]: keyof U[Key]; } : V) extends infer A ? C extends A ? Partial<C> & Required<Omit<A, keyof C>> : A extends C ? A : Partial<C> & Required<Omit<A, keyof C>> : V extends infer U ? { [Key in keyof U]: keyof U[Key]; } : V : V extends infer U ? { [Key in keyof U]: keyof U[Key]; } : V)): react.DOMElement<ComponentProps<T> & {
        className: string;
    }, Element>;
    displayName: T & string;
} | FunctionComponent<T extends any ? ComponentProps<T> : T>;

export { StyledElementOptions, tf };
