"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Post = void 0;
var _tailwind = require("./factory/tailwind");
var _checkLayer3 = require("./utils/checkLayer");
var _isIntrinsicElement = require("./utils/isIntrinsicElement");
var _stringToArray = require("./utils/stringToArray");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Post = /*#__PURE__*/function () {
  function Post() {
    _classCallCheck(this, Post);
  }
  _createClass(Post, null, [{
    key: "getMapOfClasses",
    value: function getMapOfClasses() {
      var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var classes = arguments.length > 1 ? arguments[1] : undefined;
      var haveArrow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var mapOfClasses = (0, _stringToArray.stringToArray)(classes);
      var mainClasses = [];
      var layer = 0;
      var blockType = [];
      var commaDetected = false;
      var blockContent = [];
      var childrenIndex = -1;
      var canBeABlock = false;
      var withArrow = false;
      var isInsideBlock = false;
      var result = mapOfClasses.reduce(function (prev, cur, index, list) {
        var _checkLayer = (0, _checkLayer3.checkLayer)(isInsideBlock, layer, cur),
          _checkLayer2 = _slicedToArray(_checkLayer, 2),
          isStillInsideBlock = _checkLayer2[0],
          currentLayer = _checkLayer2[1];
        isInsideBlock = isStillInsideBlock;
        layer = currentLayer;
        if (isInsideBlock) {
          blockContent.push(cur);
          return prev;
        } else if (!isInsideBlock && canBeABlock && cur === "}") {
          canBeABlock = false;
          blockContent.shift();
          prev.children[childrenIndex].elementClassNames = blockContent.join(" ");
        }
        var hasComma = cur.endsWith(",");
        var possibleElement = hasComma ? cur.replace(",", "") : cur;
        var startWithDot = cur.startsWith(".");
        var startWithHashTag = cur.startsWith("#");
        commaDetected = hasComma;
        var nextElementIsKey = index < list.length - 1 && list[index + 1] === "{" || hasComma;
        if (!canBeABlock && !canBeABlock && nextElementIsKey && ((0, _isIntrinsicElement.isIntrinsicElement)(possibleElement) || startWithDot || startWithHashTag)) {
          blockContent = [];
          if (!commaDetected) {
            childrenIndex++;
            canBeABlock = true;
            withArrow = false;
            prev.children.push({
              type: [].concat(_toConsumableArray(blockType), [cur]),
              children: [],
              withArrow: false,
              elementClassNames: ""
            });
            blockType = [];
          } else {
            blockType.push(possibleElement);
          }
          return prev;
        } else if (!canBeABlock && !canBeABlock && cur === ">") {
          blockContent = [];
          canBeABlock = true;
          withArrow = true;
          return prev;
        }
        if (canBeABlock && withArrow && !isInsideBlock) {
          if (!commaDetected) {
            childrenIndex++;
            prev.children.push({
              type: [].concat(_toConsumableArray(blockType), [cur]),
              withArrow: true,
              children: [],
              elementClassNames: ""
            });
            blockType = [];
          } else {
            blockType.push(possibleElement);
          }
          return prev;
        }
        if (!canBeABlock && !isInsideBlock && cur !== "}" && !nextElementIsKey) {
          mainClasses.push(cur);
        }
        return prev;
      }, {
        elementClassNames: "",
        children: [],
        withArrow: haveArrow,
        type: type
      });
      result.elementClassNames = mainClasses.join(" ");
      for (var c in result.children) {
        var children = result.children[c];
        result.children[c] = this.getMapOfClasses(children.type, children.elementClassNames, children.withArrow);
      }
      return result;
    }
  }, {
    key: "applyMappedClasses",
    value: function applyMappedClasses(children, mappedClasses) {
      var _this = this;
      var haveMoreThanOneChildren = Array.isArray(children);
      var listOfChildren = haveMoreThanOneChildren ? _toConsumableArray(children) : [children];
      var _loop = function _loop() {
        var _currentChildren$prop, _currentChildren$prop2, _currentChildren$prop3, _newChildren$props2, _newChildren$props3, _newChildren$props4, _newChildren$props5, _newChildren$props$cl, _newChildren$props6;
        if (typeof listOfChildren[c] === "string" || typeof listOfChildren[c] === "number") {
          return "continue";
        }
        var currentChildren = _objectSpread({}, listOfChildren[c]);
        var definedInlineClassNames = (_currentChildren$prop = (_currentChildren$prop2 = currentChildren.props) === null || _currentChildren$prop2 === void 0 ? void 0 : _currentChildren$prop2.className) !== null && _currentChildren$prop !== void 0 ? _currentChildren$prop : "";
        var firstClasses = [];
        var mapOfDefinedId = (0, _stringToArray.stringToArray)((_currentChildren$prop3 = currentChildren.props) === null || _currentChildren$prop3 === void 0 ? void 0 : _currentChildren$prop3.id);
        var mapOfDefinedInlineClassNames = (0, _stringToArray.stringToArray)(definedInlineClassNames);
        currentChildren.props = _objectSpread(_objectSpread({}, currentChildren.props), {}, {
          className: ""
        });
        for (var m in mappedClasses) {
          var _currentChildren;
          var currentClass = mappedClasses[m];
          var isTheSameType = _this.isTheSameType(currentClass, (_currentChildren = currentChildren) === null || _currentChildren === void 0 ? void 0 : _currentChildren.type, mapOfDefinedInlineClassNames, mapOfDefinedId, function (foundClass) {
            if (definedInlineClassNames.includes(foundClass)) {
              definedInlineClassNames = definedInlineClassNames.replace(foundClass, "");
              firstClasses.push(foundClass);
            }
          });
          var _newChildren = currentChildren;
          if (isTheSameType) {
            var _newChildren$props;
            var classNameInProps = (_newChildren$props = _newChildren.props) === null || _newChildren$props === void 0 ? void 0 : _newChildren$props.className;
            var inlineElementClassNames = classNameInProps ? "".concat((0, _tailwind.removeWhiteSpaceInClasses)(classNameInProps), " ") : "";
            _newChildren.props = _objectSpread(_objectSpread({}, _newChildren.props), {}, {
              className: inlineElementClassNames + currentClass.elementClassNames
            });
            listOfChildren[c] = _newChildren;
            currentChildren = listOfChildren[c];
          }
        }
        var newChildren = _objectSpread({}, currentChildren);
        var haveChildren = ((_newChildren$props2 = newChildren.props) === null || _newChildren$props2 === void 0 ? void 0 : _newChildren$props2.children) && _typeof((_newChildren$props3 = newChildren.props) === null || _newChildren$props3 === void 0 ? void 0 : _newChildren$props3.children) === "object";
        var newMappedClasses = haveChildren ? mappedClasses.filter(function (mappedClass) {
          var isTheSameType = _this.isTheSameType(mappedClass, newChildren === null || newChildren === void 0 ? void 0 : newChildren.type, mapOfDefinedInlineClassNames, mapOfDefinedId);
          return !mappedClass.withArrow || isTheSameType;
        }).reduce(function (prev, mappedClass) {
          var isTheSameType = _this.isTheSameType(mappedClass, newChildren === null || newChildren === void 0 ? void 0 : newChildren.type, mapOfDefinedInlineClassNames, mapOfDefinedId);
          var withArrow = mappedClass.withArrow;
          if (isTheSameType && withArrow) {
            prev = [].concat(_toConsumableArray(prev), _toConsumableArray(mappedClass.children));
          } else {
            prev = [].concat(_toConsumableArray(prev), [mappedClass], _toConsumableArray(mappedClass.children));
          }
          return prev;
        }, []) : [];
        var newChildrenInProps = haveChildren ? _this.applyMappedClasses(((_newChildren$props4 = newChildren.props) === null || _newChildren$props4 === void 0 ? void 0 : _newChildren$props4.children) || [], newMappedClasses) : (_newChildren$props5 = newChildren.props) === null || _newChildren$props5 === void 0 ? void 0 : _newChildren$props5.children;
        var classNamesInProps = (_newChildren$props$cl = (_newChildren$props6 = newChildren.props) === null || _newChildren$props6 === void 0 ? void 0 : _newChildren$props6.className) !== null && _newChildren$props$cl !== void 0 ? _newChildren$props$cl : "";
        var newDefinedInlineClassNames = definedInlineClassNames ? "".concat(classNamesInProps ? " " : "").concat((0, _tailwind.removeWhiteSpaceInClasses)(definedInlineClassNames)) : "";
        var newFirstClasses = "".concat(firstClasses.join(" ")).concat(firstClasses.length >= 1 && (classNamesInProps || newDefinedInlineClassNames) ? " " : "");
        newChildren.props = _objectSpread(_objectSpread({}, newChildren.props), {}, {
          children: newChildrenInProps,
          className: newFirstClasses + classNamesInProps + newDefinedInlineClassNames
        });
        listOfChildren[c] = newChildren;
        currentChildren = listOfChildren[c];
      };
      for (var c in listOfChildren) {
        var _ret = _loop();
        if (_ret === "continue") continue;
      }
      return listOfChildren;
    }
  }, {
    key: "isTheSameType",
    value: function isTheSameType(mappedClass, childrenType, classes, ids, onMatchClassType) {
      var _mappedClass$type;
      var hasTheSameType = (_mappedClass$type = mappedClass.type) === null || _mappedClass$type === void 0 ? void 0 : _mappedClass$type.includes(childrenType);
      var hasTheSameClassType = classes.some(function (definedClass) {
        var _mappedClass$type2;
        var hasTheSameClass = (_mappedClass$type2 = mappedClass.type) === null || _mappedClass$type2 === void 0 ? void 0 : _mappedClass$type2.includes("." + definedClass);
        if (hasTheSameClass) {
          onMatchClassType && onMatchClassType(definedClass);
        }
        return hasTheSameClass;
      });
      var hasTheSameIdType = ids.some(function (definedId) {
        var _mappedClass$type3;
        return (_mappedClass$type3 = mappedClass.type) === null || _mappedClass$type3 === void 0 ? void 0 : _mappedClass$type3.includes("#" + definedId);
      });
      return hasTheSameType || hasTheSameClassType || hasTheSameIdType;
    }
  }, {
    key: "children",
    value: function children(_children) {
      var classes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      var _this$getMapOfClasses = this.getMapOfClasses([], classes),
        mappedClasses = _this$getMapOfClasses.children,
        elementClassNames = _this$getMapOfClasses.elementClassNames;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      var newChildren = [];
      if (_children) {
        for (var c in _children) {
          var currentChildren = _children[c];
          if (typeof currentChildren === "string") {
            newChildren.push(currentChildren);
          } else if (currentChildren) {
            var result = this.applyMappedClasses(currentChildren, mappedClasses);
            newChildren = [].concat(_toConsumableArray(newChildren), _toConsumableArray(result));
          } else {
            newChildren.push(currentChildren);
          }
        }
      }
      return {
        newClassNames: elementClassNames,
        newChildren: newChildren
      };
    }
  }]);
  return Post;
}();
exports.Post = Post;