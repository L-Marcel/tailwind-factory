module.exports = (api) => {
  //Can be true, but I haven't tested the effects.
  api.cache(false); 
  
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          logs: process.env.NODE_ENV === "development"? "debug":"normal",
          styles: {
            config: require("./tailwind.config"),
            outputPath: "src/styles/generated.css"
          },
        },
      ],
    ],
  };
};
