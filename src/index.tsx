/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ComponentProps,
  FunctionComponent,
  createElement,
  JSXElementConstructor,
} from "react";
import { getStyledElementClassName, removeWhiteSpaceInClasses } from "./factory/tailwind";

export type StyledElementOptions<V, D> = {
  variants?: V;
  defaultVariants?: D;
};

export function tf<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  V,
  D extends {
    [Key in keyof V]?: keyof V[Key];
  }
>(element: T, styles = "", config: StyledElementOptions<V, D> = {}) {
  if (typeof element === "string") {
    type Variants = V extends infer U
      ? {
          [Key in keyof U]: keyof U[Key];
        }
      : V;

    type AllVariants = D extends infer C
      ? Variants extends infer A
        ? C extends A
          ? Partial<C> & Required<Omit<A, keyof C>>
          : A extends C
          ? A
          : Partial<C> & Required<Omit<A, keyof C>>
        : Variants
      : Variants;

    type Props = T extends JSXElementConstructor<any>
      ? ComponentProps<T>
      : T extends keyof JSX.IntrinsicElements
      ? JSX.IntrinsicElements[T]
      : never;

    const definedVariants = config?.variants
      ? Object.entries(config?.variants).reduce((prev, [key]) => {
          prev.push(key);
          return prev;
        }, [] as string[])
      : [];

    const CreatedElement = (props: Props & AllVariants) => {
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
        ? `${styles ? " " : ""}${removeWhiteSpaceInClasses(elementProps?.className)}`
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

    CreatedElement.displayName = element;
    return CreatedElement;
  } else {
    //In work...
    type Props = ComponentProps<typeof element>;
    return element as FunctionComponent<T extends any ? Props : T>;
  }
}
