import kleur from "kleur";

enum StyleErrors {
  SyntaxError = "StyleSyntaxError"
}

export class StyleError extends Error {
  constructor(public message = "", public filename: string, public stack = "") {
    super();

    super.stack = stack;
    super.message = message;
    super.name = StyleErrors.SyntaxError;

    if(stack.includes("Error: Expected expression.")) {


      let reference = stack.replace("Error: Expected expression.", "");
      const atRegex = / at /g;

      if(atRegex.test(reference)) {
        const [newReference] = reference.split(atRegex);
        reference = newReference;
      };
      
      super.message = `${kleur.italic(StyleErrors.SyntaxError)}: Expression not supported.` 
      + `${reference}\n`
      + `At ${kleur.italic(filename)}`;

      return;
    };

    super.message = `${kleur.italic(StyleErrors.SyntaxError)}: ` 
      + `${message}\n`
      + `At ${kleur.italic(filename)}`;
  };
}