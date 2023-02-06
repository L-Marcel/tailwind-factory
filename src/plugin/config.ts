import type { Config } from "tailwindcss";
import { Logs } from "./logs";

export class FactoryConfig {
  static async getTailwindConfig(configPath?: string): Promise<Config | undefined> {
    if (configPath) {
      return import(configPath)
        .then((res) => {
          return res.default;
        })
        .catch(() => {
          Logs.error("Tailwind config not found");
          return {};
        });
    }
    return;
  }
}
