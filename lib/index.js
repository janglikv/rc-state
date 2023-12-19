"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * @template State
 * @template Actions
 * @template Selectors
 *
 * @typedef {object} StoreOptions
 * @property {State} state
 * @property {Selectors} selector
 * @property {Actions} actions
 *
 * @param {StoreOptions} param0
 * @returns {{
 *   state: Selectors,
 *   Provider: React.ComponentType<{children: React.ReactNode}>,
 *   useSelector: (selector: (state:State) => State) => any,
 *   useSetState: (() => (updater: (state: State) => State) => void)
 *   useActions: () => Actions
 * }}
 */
function createStore(_ref) {
  var _ref$state = _ref.state,
    initState = _ref$state === void 0 ? {} : _ref$state,
    _ref$selector = _ref.selector,
    selector = _ref$selector === void 0 ? {} : _ref$selector,
    _ref$actions = _ref.actions,
    actions = _ref$actions === void 0 ? {} : _ref$actions;
  var StoreContext = /*#__PURE__*/(0, _react.createContext)();
  function StateKeeper(_ref2) {
    var initState = _ref2.initState;
    var context = (0, _react.useContext)(StoreContext);
    var _useState = (0, _react.useState)(initState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
    context.state = state;
    (0, _react.useMemo)(function () {
      context.setState = setState;
      var keys = Object.keys(actions);
      keys.forEach(function (key) {
        context.actions[key] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          context.setState(function (state) {
            return actions[key].apply(actions, [state].concat(args));
          });
        };
      });
    }, []);
    (0, _react.useEffect)(function () {
      var keys = Object.keys(context.callbacks);
      keys.forEach(function (uuid) {
        var _context$callbacks$uu = _slicedToArray(context.callbacks[uuid], 3),
          selector = _context$callbacks$uu[0],
          prevValue = _context$callbacks$uu[1],
          updater = _context$callbacks$uu[2];
        var newValue = selector(state);
        newValue !== prevValue && updater();
      });
    }, [state]);
    return null;
  }
  var Provider = function Provider(_ref3) {
    var children = _ref3.children,
      providerInitState = _ref3.initState;
    var value = (0, _react.useMemo)(function () {
      return {
        callbacks: {},
        uuid: 0,
        state: {},
        actions: {}
      };
    }, []);
    return /*#__PURE__*/_react["default"].createElement(StoreContext.Provider, {
      value: value
    }, /*#__PURE__*/_react["default"].createElement(StateKeeper, {
      initState: providerInitState !== null && providerInitState !== void 0 ? providerInitState : initState
    }), children);
  };
  var useSelector = function useSelector(selector) {
    var context = (0, _react.useContext)(StoreContext);
    var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      setKey = _useState4[1];
    var uuid = (0, _react.useMemo)(function () {
      return context.uuid++;
    }, []);
    var callbackRef = (0, _react.useRef)();
    callbackRef.current = (0, _react.useMemo)(function () {
      return [selector, selector(context.state), function () {
        return setKey(function (bool) {
          return !bool;
        });
      }];
    }, [selector, uuid]);
    context.callbacks[uuid] = callbackRef.current;
    (0, _react.useEffect)(function () {
      context.callbacks[uuid] = callbackRef.current;
      return function () {
        delete context.callbacks[uuid];
      };
    }, []);
    return selector(context.state);
  };
  var state = _objectSpread({}, selector);
  Object.keys(state).map(function (key) {
    state[key] = function () {
      return useSelector(selector[key]);
    };
  });
  return {
    state: state,
    Provider: Provider,
    useSelector: useSelector,
    useSetState: function useSetState() {
      return (0, _react.useContext)(StoreContext).setState;
    },
    useActions: function useActions() {
      return (0, _react.useContext)(StoreContext).actions;
    }
  };
}