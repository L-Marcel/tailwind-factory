/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NodePath } from "@babel/core";
import { createMacro, MacroParams } from "babel-plugin-macros";
import * as Babel from "@babel/core";

export default createMacro(tf, {
  configName: "tailwind-factory",
});

function tf({ references, state, babel }: MacroParams) {
  references.default.forEach((referencePath) => {
    if (referencePath.parentPath!.type === "CallExpression") {
      if (referencePath === referencePath.parentPath!.get("callee")) {
        const macroArguments = referencePath.parentPath!.get("arguments") as [
          any,
          NodePath<Babel.types.TemplateLiteral>,
          any
        ];

        if (Array.isArray(macroArguments) && macroArguments.length >= 2) {
          const classes = macroArguments[1].node.quasis[0].value.raw;
          const haveSpace = /\n/g.test(classes);

          let styles = haveSpace ? classes.split("\n") : [classes];
          styles = styles.filter((style) => {
            return style;
          });

          const result = styles
            .map((style) => {
              return " ${...tw`" + style.trim() + "`}";
            })
            .join("\n");

          console.log(result);
          macroArguments[1].node.quasis[0].value.raw = `\n${result}\n`;
        }
      }
    } else {
      console.error("Invalid call signature");
    }
  });
}
