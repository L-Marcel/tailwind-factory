import path from "path";
import { NextConfig } from "next";

export function webpackWithFactory(config: any) {
  config.cache = {
    type: "memory",
    ...config?.cache,
    buildDependencies: {
      config: [...config?.cache?.buildDependencies?.config, path.resolve("tailwind.config.js")]
    }
  };

  return config;
};

export function nextWithFactory(nextConfig: NextConfig): NextConfig {
  return {
    ...nextConfig,
    webpack(config, options) {
      config = webpackWithFactory(config);
      
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    },
  };
}
