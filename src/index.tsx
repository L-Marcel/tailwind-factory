/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ComponentProps,
  createElement,
  JSXElementConstructor,
  FunctionComponent,
  ReactElement,
} from "react";

import { getStyledElementClassName, removeWhiteSpaceInClasses } from "./factory/tailwind";

export type FactoryElement =
  | keyof JSX.IntrinsicElements
  | FunctionComponent
  | JSXElementConstructor<any>;

export type FactoryExtractKeys<V> = {
  [Key in keyof V]?: keyof V[Key];
};

export type StyledElementOptions<V, D, O> = {
  variants?: V;
  defaultVariants?: D & Partial<O>;
};

export function tf<T extends FactoryElement, V, D, O extends FactoryExtractKeys<V>>(
  element: T,
  styles = "",
  config: StyledElementOptions<V, D, O> = {}
) {
  type Variants = V extends infer U ? FactoryExtractKeys<U> : V;

  type AllVariants = D extends infer C
    ? Partial<Variants> & Required<Omit<Variants, keyof C>>
    : Variants;

  type Props = T extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[T]
    : T extends infer X
    ? ComponentProps<typeof element>
    : ComponentProps<T>;

  const definedVariants = config?.variants
    ? Object.entries(config?.variants).reduce((prev, [key]) => {
        prev.push(key);
        return prev;
      }, [] as string[])
    : [];

  const FinalElement = (props: Props & AllVariants) => {
    type ElementProporties = {
      elementProps: Props;
      variants: Variants;
    };

    const { elementProps, variants } = Object.entries(props).reduce(
      (prev, [key, value]) => {
        if (definedVariants.includes(key)) {
          Object.assign(prev.variants as any, {
            [key]: value,
          });
        } else {
          Object.assign(prev.elementProps as any, {
            [key]: value,
          });
        }

        return prev;
      },
      {
        elementProps: {},
        variants: {
          ...(config?.defaultVariants || {}),
        },
      } as ElementProporties
    );

    const elementClassName = getStyledElementClassName(
      styles,
      variants,
      config?.variants || {}
    );

    const classNameInProps = elementProps?.className
      ? `${elementClassName ? " " : ""}${removeWhiteSpaceInClasses(
          elementProps?.className
        )}`
      : "";

    return createElement(
      element,
      {
        ...elementProps,
        className: elementClassName + classNameInProps,
      },
      elementProps?.children
    );
  };

  return FinalElement;
}
