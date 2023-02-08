/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";

export type LogsMode = "none" | "all" | "normal" | "debug" | "errors";
type LogsColors = "blue" | "red" | "yellow" | "green";

const possibleExceptions = ["uncaughtException"];

const expectedMessages = [
  "No utility classes were detected in your source files. If this is unexpected, double-check the `content` option in your Tailwind CSS configuration.",
  "tailwindcss.com/docs/content-configuration",
];

type LogOptions = {
  newLine: boolean;
  debug: boolean;
  tag: string;
  color: LogsColors;
}
export class Logs {
  private static mode: LogsMode = "errors";

  private static _warn = console.warn;
  private static _error = console.error;

  static init(mode: LogsMode) {
    Logs.mode = mode;
  }

  static printedMessages: string[] = [];

  private static addNowAndRemoveAfter(message: string, time: number) {
    Logs.printedMessages.push(message);
    setTimeout(() => {
      Logs.debug("message deleted: ", message);
      Logs.printedMessages = Logs.printedMessages.filter((printedMessage) => {
        return printedMessage !== message;
      });
    }, time);
  }

  private static log(
    { color, debug, newLine, tag }: LogOptions,
    message: string,
    ...rest: any[]
  ) {
    const alreadyPrinted = Logs.printedMessages.includes(message);

    if (!alreadyPrinted) {
      console.log(
        `${newLine ? "\n" : ""}${kleur[color](tag.padEnd(5, " "))} ~ ${message}`,
        ...rest
      );

      if (!debug) {
        return Logs.addNowAndRemoveAfter(message, 10000);
      }

      return;
    }
  }

  static debug(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none" && Logs.mode !== "errors";

    isEnabled && Logs.log({
      newLine: false, 
      debug: true,
      tag: "debug", 
      color: "green"
    }, message, ...rest);
  }

  static info(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none" && Logs.mode !== "errors";

    isEnabled && Logs.log({
      newLine: false, 
      debug: false,
      tag: "style", 
      color: "blue"
    }, message, ...rest);
  }

  static error(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none";

    isEnabled && Logs.log({
      newLine: true, 
      debug: false,
      tag: "error", 
      color: "red"
    }, message, ...rest, "\n");
  }

  static warning(message: any, ...rest: any[]) {
    const isEnabled = Logs.mode !== "none";

    isEnabled && Logs.log({
      newLine: true,
      debug: false,
      tag: "warn",
      color: "yellow"
    }, message, ...rest, "\n");
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
