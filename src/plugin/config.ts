import type { Config } from "tailwindcss";
import { Logs } from "./logs";

export class FactoryConfig {
  static async getTailwindConfig(configPath?: string): Promise<Config | undefined> {
    if (configPath) {
      return import(configPath)
        .then((res) => {
          return res.default;
        })
        .catch((err) => {
          Logs.info(configPath);
          Logs.error("Tailwind config not found");
          Logs.error(err);
          return {};
        });
    }
    return;
  }
}
