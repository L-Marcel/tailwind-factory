/* eslint-disable @typescript-eslint/no-explicit-any */
import kleur from "kleur";
import { PluginPreset } from ".";

export class Logs {
  private static preset: PluginPreset = "react";
  static printedMessages: string[] = [];
  static specialMessages: string[] = ["styles updated"];

  static info(message: string, ...rest: any[]) {
    const runningInSSR = this.preset === "next";
    const alreadyPrinted = this.printedMessages.includes(message);
    const isSpecialMessage = this.specialMessages.includes(message);

    if (!runningInSSR || !alreadyPrinted) {
      console.log(`${kleur.blue("style")} - ${message}`, ...rest);
      this.printedMessages.push(message);
    } else if (isSpecialMessage) {
      this.printedMessages = this.printedMessages.filter((printedMessage) => {
        return printedMessage !== message;
      });
    }
  }

  static error(message: string, ...rest: any[]) {
    if (!this.printedMessages.includes(message)) {
      console.log(`${kleur.red("style")} - ${message}`, ...rest);
      this.printedMessages.push(message);
    }
  }

  static warning(message: string, ...rest: any[]) {
    if (!this.printedMessages.includes(message)) {
      console.log(`${kleur.yellow("style ")} - ${message}`, ...rest);
      this.printedMessages.push(message);
    }
  }

  static changePreset(preset: PluginPreset) {
    this.preset = preset;
  }
}
