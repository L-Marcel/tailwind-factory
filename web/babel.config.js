module.exports = (api) => {
  api.cache(false);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          styles: {
            config: "../web/tailwind.config.js",
            inputPath: "../web/src/styles/global.css",
          },
        },
      ],
    ],
  };
};
