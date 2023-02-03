module.exports = {
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
