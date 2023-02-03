module.exports = function (api) {
  api.cache(false);
  return {
    presets: ["next/babel"],
    plugins: ["tailwind-factory/plugin"],
  };
};
