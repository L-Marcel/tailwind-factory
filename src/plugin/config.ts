import type { Config } from "tailwindcss";
export class FactoryConfig {
  static async getTailwindConfig(
    config: Promise<Config | undefined>
  ): Promise<Config | undefined> {
    if (config) {
      const loadedConfig = await config;
      return loadedConfig;
    }

    return;
  }
}
