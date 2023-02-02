"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withFactory = withFactory;
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function withFactory(_ref, nextConfig) {
  var dirs = _ref.dirs;
  var _require = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : require;
  var includedDirs = dirs.map(function (dir) {
    return _path["default"].resolve(__dirname, dir);
  });
  console.log(_require.resolve("tailwind-factory/plugin"));
  return _objectSpread(_objectSpread({}, nextConfig), {}, {
    webpack: function webpack(config, options) {
      var dev = options.dev,
        isServer = options.isServer;
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(tsx|ts)$/,
        include: includedDirs,
        use: [options.defaultLoaders.babel, {
          loader: "babel-loader",
          options: {
            sourceMaps: dev,
            plugins: [[_require.resolve("tailwind-factory/plugin")], [_require.resolve("@babel/plugin-syntax-typescript"), {
              isTSX: true
            }]]
          }
        }]
      });
      if (!isServer) {
        config.resolve.fallback = _objectSpread(_objectSpread({}, config.resolve.fallback || {}), {}, {
          fs: false,
          module: false,
          path: false,
          os: false,
          crypto: false
        });
      }
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      } else {
        return config;
      }
    }
  });
}