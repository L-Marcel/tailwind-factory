module.exports = (api) => {
  api.cache(false);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          styles: {
            config: require("./tailwind.config"),
            outputPath: "src/styles/generated.css"
          },
        },
      ],
    ],
  };
};
