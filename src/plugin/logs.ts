/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";
import { PluginPreset } from ".";

type LogsColors = "blue" | "red" | "yellow";
export class Logs {
  private static preset: PluginPreset = "react";
  static printedMessages: string[] = [];
  static specialMessages: string[] = ["styles updated"];

  private static log(color: LogsColors, message: string, ...rest: any[]) {
    const runningInSSR = this.preset === "next";
    const alreadyPrinted = this.printedMessages.includes(message);
    const isSpecialMessage = this.specialMessages.includes(message);

    if (!runningInSSR || !alreadyPrinted) {
      console.log(`${kleur[color]("style")} - ${message}`, ...rest);
      this.printedMessages.push(message);
    } else if (isSpecialMessage) {
      this.printedMessages = this.printedMessages.filter((printedMessage) => {
        return printedMessage !== message;
      });
    }
  }

  static info(message: string, ...rest: any[]) {
    this.log("blue", message, ...rest);
  }

  static error(message: string, ...rest: any[]) {
    this.log("red", message, ...rest);
  }

  static warning(message: string, ...rest: any[]) {
    this.log("yellow", message, ...rest);
  }

  static changePreset(preset: PluginPreset) {
    this.preset = preset;
  }
}
