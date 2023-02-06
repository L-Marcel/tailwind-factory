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

  private static log(newLine: boolean, tag: string, color: LogsColors, message: string, ...rest: any[]) {
    const alreadyPrinted = this.printedMessages.includes(message);

    if (!alreadyPrinted) {
      console.log(`${newLine? "\n":""}${kleur[color](tag.padEnd(5, " "))} ~ ${message}`, ...rest);
      Logs.printedMessages.push(message);
    }
  }

  static info(message: string, ...rest: any[]) {
    Logs.log(false, "style", "blue", message);
  }

  static error(message: string, ...rest: any[]) {
    Logs.log(true, "error", "red", message, ...[...rest, "\n"]);
  }

  static warning(message: string, ...rest: any[]) {
    Logs.log(true, "warn", "yellow", message, ...[...rest, "\n"]);
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

      return Logs._warn(...rest);
    };
  }

  static restoreExpectedWarnings() {
    return Logs._warn;
  }
}
