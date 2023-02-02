// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require("path");

module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          styles: {
            path: resolve(__dirname, "src", "styles", "factory.css"),
          },
        },
      ],
    ],
  };
};
