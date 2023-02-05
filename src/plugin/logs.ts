/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";

type LogsColors = "blue" | "red" | "yellow";
export class Logs {
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
}
