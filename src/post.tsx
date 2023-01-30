import { removeWhiteSpaceInClasses } from "./factory/tailwind";
import { checkLayer } from "./utils/checkLayer";
import { isIntrinsicElement } from "./utils/isIntrinsicElement";

type ChildrenType = {
  type: string;
  props: {
    children?: ChildrenType | ChildrenType[];
    className?: string;
  };
};

type MappedClasses = {
  type?: string;
  elementClassNames: string;
  withArrow: boolean;
  children: MappedClasses[];
};

export class Post {
  static getMapOfClasses(type = "", classes: string, haveArrow = false) {
    const haveSpace = / /g.test(classes);
    const mapOfClasses = haveSpace ? classes?.split(" ") : classes ? [classes] : [];

    const mainClasses: string[] = [];

    let layer = 0;
    let blockContent: string[] = [];
    let childrenIndex = -1;
    let canBeABlock = false;
    let withArrow = false;
    let isInsideBlock = false;
    const result = mapOfClasses.reduce(
      (prev, cur) => {
        const [isStillInsideBlock, currentLayer] = checkLayer(isInsideBlock, layer, cur);
        isInsideBlock = isStillInsideBlock;
        layer = currentLayer;

        if (isInsideBlock) {
          blockContent.push(cur);
          return prev;
        } else if (!isInsideBlock && canBeABlock && cur === "}") {
          canBeABlock = false;

          blockContent.shift();
          prev.children[childrenIndex].elementClassNames = blockContent.join(" ");
        }

        if (!canBeABlock && !canBeABlock && isIntrinsicElement(cur)) {
          blockContent = [];
          childrenIndex++;
          canBeABlock = true;
          withArrow = false;

          prev.children.push({
            type: cur,
            children: [],
            withArrow: false,
            elementClassNames: "",
          });

          return prev;
        } else if (!canBeABlock && !canBeABlock && cur === ">") {
          blockContent = [];
          canBeABlock = true;
          withArrow = true;

          return prev;
        }

        if (canBeABlock && withArrow && !isInsideBlock) {
          childrenIndex++;

          prev.children.push({
            type: cur,
            withArrow: true,
            children: [],
            elementClassNames: "",
          });

          return prev;
        }

        if (!canBeABlock && !isInsideBlock && cur !== "}") {
          mainClasses.push(cur);
        }

        return prev;
      },
      {
        elementClassNames: "",
        children: [],
        withArrow: haveArrow,
        type,
      } as MappedClasses
    );

    result.elementClassNames = mainClasses.join(" ");

    for (const c in result.children) {
      const children = result.children[c];
      result.children[c] = this.getMapOfClasses(
        children.type,
        children.elementClassNames,
        children.withArrow
      );
    }

    return result;
  }

  static applyMappedClasses(
    children: ChildrenType | ChildrenType[],
    mappedClasses: MappedClasses[]
  ) {
    const haveMoreThanOneChildren = Array.isArray(children);
    const listOfChildren = haveMoreThanOneChildren ? [...children] : [children];

    for (const c in listOfChildren) {
      let currentChildren = { ...listOfChildren[c] };
      const definedInlineClassNames = currentChildren.props?.className;

      currentChildren.props = {
        ...currentChildren.props,
        className: "",
      };

      for (const m in mappedClasses) {
        const currentClass = mappedClasses[m];
        const isTheSameType = currentChildren.type === currentClass.type;
        const newChildren = currentChildren;

        if (isTheSameType) {
          const classNameInProps = newChildren.props?.className;
          const inlineElementClassNames = classNameInProps
            ? `${removeWhiteSpaceInClasses(classNameInProps)} `
            : "";

          newChildren.props = {
            ...newChildren.props,
            className: inlineElementClassNames + currentClass.elementClassNames,
          };

          listOfChildren[c] = newChildren;
          currentChildren = listOfChildren[c];
        }
      }

      const newChildren = { ...currentChildren };

      const haveChildren =
        newChildren.props?.children && typeof newChildren.props?.children === "object";

      const newMappedClasses = haveChildren
        ? mappedClasses
            .filter((mappedClass) => {
              const mapHaveTheSameType = mappedClass.type === newChildren.type;
              return !mappedClass.withArrow || mapHaveTheSameType;
            })
            .reduce((prev, mappedClass) => {
              const mapHaveTheSameType = mappedClass.type === newChildren.type;
              const withArrow = mappedClass.withArrow;

              if (mapHaveTheSameType && withArrow) {
                prev = [...prev, ...mappedClass.children];
              } else {
                prev.push(mappedClass);
              }

              return prev;
            }, [] as MappedClasses[])
        : [];

      const newChildrenInProps = haveChildren
        ? this.applyMappedClasses(newChildren.props?.children || [], newMappedClasses)
        : newChildren.props?.children;

      const classNamesInProps = newChildren.props?.className ?? "";
      const newDefinedInlineClassNames = definedInlineClassNames
        ? `${classNamesInProps ? " " : ""}${removeWhiteSpaceInClasses(
            definedInlineClassNames
          )}`
        : "";

      newChildren.props = {
        ...newChildren.props,
        children: newChildrenInProps,
        className: classNamesInProps + newDefinedInlineClassNames,
      };

      listOfChildren[c] = newChildren;
      currentChildren = listOfChildren[c];
    }

    return listOfChildren;
  }

  static children(children?: ChildrenType | ChildrenType[], classes = "") {
    const { children: mappedClasses, elementClassNames } = this.getMapOfClasses(
      "",
      classes
    );

    const newChildren = children
      ? this.applyMappedClasses(children, mappedClasses)
      : children;

    return {
      newClassNames: elementClassNames,
      newChildren,
    };
  }
}

// {
//   elementClassNames: 'bg-lime-200 w-4',
//   children: [
//     {
//       elementClassNames: 'flex flex-col bg-blue-200',
//       children: [Array],
//       withArrow: false,
//       type: 'div'
//     },
//     {
//       elementClassNames: 'text-red-400',
//       children: [],
//       withArrow: false,
//       type: 'h2'
//     }
//   ],
//   withArrow: false,
//   type: ''
// }
