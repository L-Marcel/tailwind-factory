import React from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function parseToChildren(value: any) {
  const children: any[] = React.Children.toArray(value);

  for (const c in children) {
    let newChildren = children[c];
    const isObject =
      typeof children[c] !== "string" &&
      typeof children[c] !== "number" &&
      children[c]?.props?.children;

    if (isObject) {
      newChildren = {
        ...newChildren,
        props: {
          ...newChildren.props,
          children: parseToChildren(children[c]?.props?.children),
        },
      };

      children[c] = newChildren;
    }
  }

  return children;
}
