module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          styles: {
            config: "../web/tailwind.config.js",
          },
        },
      ],
    ],
  };
};
