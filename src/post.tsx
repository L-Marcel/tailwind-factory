import { removeWhiteSpaceInClasses } from "./factory/tailwind";
import { checkLayer } from "./utils/checkLayer";
import { isIntrinsicElement } from "./utils/isIntrinsicElement";
import { stringToArray } from "./utils/stringToArray";

type ChildrenType = {
  type: string;
  props: {
    children?: ChildrenType | ChildrenType[];
    className?: string;
    id?: string;
  };
};

type MappedClasses = {
  type?: string[];
  elementClassNames: string;
  withArrow: boolean;
  children: MappedClasses[];
};

export class Post {
  private static getMapOfClasses(
    type: string[] = [],
    classes: string,
    haveArrow = false
  ) {
    const mapOfClasses = stringToArray(classes);
    const mainClasses: string[] = [];

    let layer = 0;
    let blockType: string[] = [];
    let commaDetected = false;
    let blockContent: string[] = [];
    let childrenIndex = -1;
    let canBeABlock = false;
    let withArrow = false;
    let isInsideBlock = false;
    const result = mapOfClasses.reduce(
      (prev, cur, index, list) => {
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

        const hasComma = cur.endsWith(",");
        const possibleElement = hasComma ? cur.replace(",", "") : cur;

        const startWithDot = cur.startsWith(".");
        const startWithHashTag = cur.startsWith("#");

        commaDetected = hasComma;
        const nextElementIsKey =
          (index < list.length - 1 && list[index + 1] === "{") || hasComma;

        if (
          !canBeABlock &&
          !canBeABlock &&
          nextElementIsKey &&
          (isIntrinsicElement(possibleElement) || startWithDot || startWithHashTag)
        ) {
          blockContent = [];

          if (!commaDetected) {
            childrenIndex++;
            canBeABlock = true;
            withArrow = false;

            prev.children.push({
              type: [...blockType, cur],
              children: [],
              withArrow: false,
              elementClassNames: "",
            });

            blockType = [];
          } else {
            blockType.push(possibleElement);
          }

          return prev;
        } else if (!canBeABlock && !canBeABlock && cur === ">") {
          blockContent = [];
          canBeABlock = true;
          withArrow = true;

          return prev;
        }

        if (canBeABlock && withArrow && !isInsideBlock) {
          if (!commaDetected) {
            childrenIndex++;

            prev.children.push({
              type: [...blockType, cur],
              withArrow: true,
              children: [],
              elementClassNames: "",
            });

            blockType = [];
          } else {
            blockType.push(possibleElement);
          }

          return prev;
        }

        if (!canBeABlock && !isInsideBlock && cur !== "}" && !nextElementIsKey) {
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

  private static applyMappedClasses(
    children: ChildrenType | ChildrenType[],
    mappedClasses: MappedClasses[]
  ) {
    const haveMoreThanOneChildren = Array.isArray(children);
    const listOfChildren = haveMoreThanOneChildren ? [...children] : [children];

    for (const c in listOfChildren) {
      if (
        typeof listOfChildren[c] === "string" ||
        typeof listOfChildren[c] === "number"
      ) {
        continue;
      }

      let currentChildren = { ...listOfChildren[c] };
      let definedInlineClassNames = currentChildren.props?.className ?? "";
      const firstClasses: string[] = [];

      const mapOfDefinedId = stringToArray(currentChildren.props?.id);
      const mapOfDefinedInlineClassNames = stringToArray(definedInlineClassNames);

      currentChildren.props = {
        ...currentChildren.props,
        className: "",
      };

      for (const m in mappedClasses) {
        const currentClass = mappedClasses[m];

        const isTheSameType = this.isTheSameType(
          currentClass,
          currentChildren?.type,
          mapOfDefinedInlineClassNames,
          mapOfDefinedId,
          (foundClass) => {
            if (definedInlineClassNames.includes(foundClass)) {
              definedInlineClassNames = definedInlineClassNames.replace(foundClass, "");
              firstClasses.push(foundClass);
            }
          }
        );

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
              const isTheSameType = this.isTheSameType(
                mappedClass,
                newChildren?.type,
                mapOfDefinedInlineClassNames,
                mapOfDefinedId
              );

              return !mappedClass.withArrow || isTheSameType;
            })
            .reduce((prev, mappedClass) => {
              const isTheSameType = this.isTheSameType(
                mappedClass,
                newChildren?.type,
                mapOfDefinedInlineClassNames,
                mapOfDefinedId
              );

              const withArrow = mappedClass.withArrow;

              if (isTheSameType && withArrow) {
                prev = [...prev, ...mappedClass.children];
              } else {
                prev = [...prev, mappedClass, ...mappedClass.children];
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

      const newFirstClasses = `${firstClasses.join(" ")}${
        firstClasses.length >= 1 && (classNamesInProps || newDefinedInlineClassNames)
          ? " "
          : ""
      }`;

      newChildren.props = {
        ...newChildren.props,
        children: newChildrenInProps,
        className: newFirstClasses + classNamesInProps + newDefinedInlineClassNames,
      };

      listOfChildren[c] = newChildren;
      currentChildren = listOfChildren[c];
    }

    return listOfChildren;
  }

  private static isTheSameType(
    mappedClass: MappedClasses,
    childrenType: string,
    classes: string[],
    ids: string[],
    onMatchClassType?: (foundClass: string) => void
  ) {
    const hasTheSameType = mappedClass.type?.includes(childrenType);

    const hasTheSameClassType = classes.some((definedClass) => {
      const hasTheSameClass = mappedClass.type?.includes("." + definedClass);

      if (hasTheSameClass) {
        onMatchClassType && onMatchClassType(definedClass);
      }

      return hasTheSameClass;
    });

    const hasTheSameIdType = ids.some((definedId) => {
      return mappedClass.type?.includes("#" + definedId);
    });

    return hasTheSameType || hasTheSameClassType || hasTheSameIdType;
  }

  static children(children?: ChildrenType[], classes = "") {
    const { children: mappedClasses, elementClassNames } = this.getMapOfClasses(
      [],
      classes
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newChildren: any[] = [];

    if (children) {
      for (const c in children) {
        const currentChildren = children[c];

        if (typeof currentChildren === "string") {
          newChildren.push(currentChildren);
        } else if (currentChildren) {
          const result = this.applyMappedClasses(currentChildren, mappedClasses);
          newChildren = [...newChildren, ...result];
        } else {
          newChildren.push(currentChildren);
        }
      }
    }

    return {
      newClassNames: elementClassNames,
      newChildren,
    };
  }
}
