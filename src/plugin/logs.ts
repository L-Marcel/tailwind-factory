/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";

export type LogsMode = "recommended" | "none" | "all";
type LogsColors = "blue" | "red" | "yellow";

const possibleExceptions = ["uncaughtException"];

const expectedMessages = [
  "No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.",
  "tailwindcss.com/docs/content-configuration",
];

const specialMessages = ["detected by the validator"];

export class Logs {
  private static mode: LogsMode = "recommended";

  private static _warn = console.warn;
  private static _error = console.error;

  static init(mode: LogsMode) {
    Logs.mode = mode;
  }

  static printedMessages: string[] = [];

  private static addNowAndRemoveAfter(message: string, time: number) {
    Logs.printedMessages.push(message);
    setTimeout(() => {
      Logs.printedMessages = Logs.printedMessages.filter((printedMessage) => {
        return printedMessage !== message;
      });
    }, time);
  }

  private static log(
    newLine: boolean,
    tag: string,
    color: LogsColors,
    message: string,
    ...rest: any[]
  ) {
    const alreadyPrinted = Logs.printedMessages.includes(message);
    const isSpecial = specialMessages.some((specialMessage) => {
      return message.includes(specialMessage);
    });

    if (!alreadyPrinted) {
      console.log(
        `${newLine ? "\n" : ""}${kleur[color](tag.padEnd(5, " "))} ~ ${message}`,
        ...rest
      );

      if (isSpecial) {
        return Logs.addNowAndRemoveAfter(message, 2000);
      }

      return Logs.printedMessages.push(message);
    }
  }

  static info(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none";

    isEnabled && Logs.log(false, "style", "blue", message, ...rest);
  }

  static error(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none";

    isEnabled && Logs.log(true, "error", "red", message, ...rest, "\n");
  }

  static warning(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none";

    isEnabled && Logs.log(true, "warn", "yellow", message, ...rest, "\n");
  }

  static omitExpectedWarnings() {
    const isUnnecessary = Logs.mode === "none" || Logs.mode === "all";

    if (isUnnecessary) {
      return Logs._warn;
    }

    return (...rest: any[]) => {
      if (
        typeof rest.toString() === "string" &&
        expectedMessages.some((expectedMessage) => {
          return rest.toString().includes(expectedMessage);
        })
      ) {
        return;
      }

      return Logs._warn("\n", ...rest, "\n");
    };
  }

  static restoreExpectedWarnings() {
    return Logs._warn;
  }

  static omitUncaughtException() {
    const isUnnecessary = Logs.mode === "none" || Logs.mode === "all";

    if (isUnnecessary) {
      return Logs._error;
    }

    return (...rest: any[]) => {
      if (
        typeof rest.toString() === "string" &&
        possibleExceptions.some((possibleException) => {
          return rest.toString().includes(possibleException);
        })
      ) {
        return;
      }

      return Logs._error("\n", ...rest, "\n");
    };
  }

  static restoreUncaughtException() {
    return Logs._error;
  }
}
