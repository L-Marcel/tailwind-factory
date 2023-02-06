/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";

type LogsColors = "blue" | "red" | "yellow";

const expectedMessages = [
  "No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.",
  "tailwindcss.com/docs/content-configuration",
];

export class Logs {
  private static _warn = console.warn;

  static printedMessages: string[] = [];

  private static log(color: LogsColors, message: string, ...rest: any[]) {
    const alreadyPrinted = this.printedMessages.includes(message);

    if (!alreadyPrinted) {
      console.log(`${kleur[color]("style")} - ${message}`, ...rest);
      Logs.printedMessages.push(message);
    }
  }

  static info(message: string, ...rest: any[]) {
    Logs.log("blue", message, ...rest);
  }

  static error(message: string, ...rest: any[]) {
    Logs.log("red", message, ...rest);
  }

  static warning(message: string, ...rest: any[]) {
    Logs.log("yellow", message, ...rest);
  }

  static omitExpectedWarnings() {
    return (...rest: any[]) => {
      if (
        typeof rest.toString() === "string" &&
        expectedMessages.some((expectedMessage) => {
          return rest.toString().includes(expectedMessage);
        })
      ) {
        return;
      }

      return Logs._warn(rest.toString(), ...rest);
    };
  }

  static restoreExpectedWarnings() {
    return Logs._warn;
  }
}
