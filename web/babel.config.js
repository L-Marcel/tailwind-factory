module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["next/babel"],
    plugins: [
      [
        "tailwind-factory/plugin",
        {
          preset: "next", //default: react
        },
      ],
    ],
  };
};
