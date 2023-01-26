import {
  removeWhiteSpaceInClasses,
  getStyledElementClassName,
} from "../../../src/factory/tailwind";
describe("[Factory] Tailwind", () => {
  it("Should be able to remove unnecessary white spaces", () => {
    const text = `

    one
       two   three   


       four

        five
six  seven   eight  
    
    `;

    const textWithoutUnnecessarySpaces = removeWhiteSpaceInClasses(text);
    expect(textWithoutUnnecessarySpaces).toBe("one two three four five six seven eight");
  });

  it("Should be able to format classes without variants", () => {
    const styles = `
      one
      two   
      three 
    `;

    const classNames = getStyledElementClassName(styles, {}, {});

    expect(classNames).toBe("one two three");
  });

  it("Should be able to format classes with variants", () => {
    const styles = `
      one
      two three 
    `;

    const props = {
      size: "sm",
    };

    const altProps = {
      size: "md",
      color: "red",
    };

    const variants = {
      size: {
        sm: `
          small border
          visible
        `,
        md: `
          big 
          visible
        `,
      },
    };

    const altVariants = {
      ...variants,
      color: {
        red: `
          text-red
        `,
        blue: `
          text-blue
        `,
      },
    };

    const classNames = getStyledElementClassName(styles, props, variants);
    const classNamesTwo = getStyledElementClassName(styles, altProps, variants);
    const classNamesThree = getStyledElementClassName(styles, altProps, altVariants);

    expect(classNames).toBe("one two three small border visible");
    expect(classNamesTwo).toBe("one two three big visible");
    expect(classNamesThree).toBe("one two three big visible text-red");
  });
});
