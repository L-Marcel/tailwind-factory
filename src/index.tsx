/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentProps, createElement, JSXElementConstructor } from "react";
import { getStyledElementClassName, removeWhiteSpaceInClasses } from "./factory/tailwind";
import { uniteProperties } from "./utils/uniteProperties";
import { Post } from "./post";
import { parseToChildren } from "./utils/parseToChildren";

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
};

export type FactoryElement = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

export function tf<
  Type extends FactoryElement,
  StyleVariants,
  DefaultStyleVariants,
  DefaultStyleVariantsScheme extends FactoryExtractKeys<StyleVariants>
>(
  element: Type,
  styles = "",
  config: StyledElementOptions<
    StyleVariants,
    DefaultStyleVariants,
    DefaultStyleVariantsScheme
  > = {}
) {
  type Props = ComponentProps<Type>;

  type Variants = StyleVariants extends infer U ? FactoryExtractKeys<U> : any;

  type AllVariants = DefaultStyleVariants extends infer C
    ? Partial<Variants> & Required<Omit<Variants, keyof C>>
    : Variants;

  const definedVariants = config?.variants
    ? Object.entries(config?.variants).reduce((prev, [key]) => {
        prev.push(key);
        return prev;
      }, [] as string[])
    : [];

  function CreatedElement(props: Props & AllVariants) {
    type ElementProperties = {
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
          if (key === "children") {
            value = parseToChildren(value);
          }

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
      } as ElementProperties
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

    let className = elementClassName + classNameInProps;
    let children = elementProps?.children;

    if (className.includes("{") && className.includes("}")) {
      const { newChildren, newClassNames } = Post.children(children, className);

      children = newChildren;
      className = newClassNames;
    }

    return createElement(
      element,
      {
        ...elementProps,
        className,
      },
      children
    ) as JSX.Element;
  }

  function extendsElement<
    NewType extends FactoryElement | null,
    NewStyleVariants,
    NewDefaultStyleVariants,
    NewDefaultStyleVariantsScheme extends FactoryExtractKeys<
      FactoryExtractRequiredKeysAndValues<StyleVariants> & NewStyleVariants
    >
  >(
    newElement?: NewType,
    newStyles = "",
    newConfig: StyledElementOptions<
      NewStyleVariants & FactoryExtractKeysAndValues<StyleVariants>,
      NewDefaultStyleVariants,
      NewDefaultStyleVariantsScheme
    > = {}
  ) {
    type NewProps = NewType extends FactoryElement ? ComponentProps<NewType> : Props;

    type NewVariantsUnion = StyleVariants & NewStyleVariants;
    type NewVariants = NewVariantsUnion extends infer U ? FactoryExtractKeys<U> : any;

    type NewAllVariants = NewDefaultStyleVariants extends infer C
      ? DefaultStyleVariants extends infer O
        ? Partial<NewVariants> & Required<Omit<NewVariants, keyof (O & C)>>
        : Partial<NewVariants> & Required<Omit<NewVariants, keyof C>>
      : NewVariants;

    const extendedConfig = uniteProperties(config, newConfig);

    const definedVariants = extendedConfig?.variants
      ? Object.entries(extendedConfig?.variants).reduce((prev, [key]) => {
          prev.push(key);
          return prev;
        }, [] as string[])
      : [];

    function CreatedExtendedElement(props: NewProps & NewAllVariants) {
      type ElementProperties = {
        elementProps: Props;
        variants: NewAllVariants;
      };

      const { elementProps, variants } = Object.entries(props).reduce(
        (prev, [key, value]) => {
          if (definedVariants.includes(key)) {
            Object.assign(prev.variants as any, {
              [key]: String(value),
            });
          } else {
            if (key === "children") {
              value = parseToChildren(value);
            }

            Object.assign(prev.elementProps as any, {
              [key]: value,
            });
          }

          return prev;
        },
        {
          elementProps: {},
          variants: {
            ...(extendedConfig?.defaultVariants || {}),
          },
        } as ElementProperties
      );

      const elementClassName = getStyledElementClassName(
        styles + (styles ? " " : "") + newStyles,
        variants,
        extendedConfig?.variants || {}
      );

      const classNameInProps = elementProps?.className
        ? `${elementClassName ? " " : ""}${removeWhiteSpaceInClasses(
            elementProps?.className
          )}`
        : "";

      let className = elementClassName + classNameInProps;
      let children = elementProps?.children;

      if (className.includes("{") && className.includes("}")) {
        const { newChildren, newClassNames } = Post.children(children, className);
        children = newChildren;
        className = newClassNames;
      }

      return createElement(
        newElement ?? element,
        {
          ...elementProps,
          className,
        },
        children
      ) as JSX.Element;
    }

    return Object.assign(CreatedExtendedElement, {
      extends: extendsElement,
    });
  }

  return Object.assign(CreatedElement, {
    extends: extendsElement,
  });
}

export { removeWhiteSpaceInClasses };
