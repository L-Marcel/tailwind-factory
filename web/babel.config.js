module.exports = (api) => {
  api.cache(true);
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
