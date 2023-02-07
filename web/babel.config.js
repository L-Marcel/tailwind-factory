const path = require("path");

module.exports = (api) => {
  api.cache(false);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          styles: {
            outputPath: "src/styles/generated.css"
          },
        },
      ],
    ],
  };
};
