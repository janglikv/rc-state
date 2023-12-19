import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * @template State
 * @template Actions
 * @template Selectors
 * @param {object} param0
 * @param {State} param0.state
 * @param {Selectors} param0.selector
 * @param {Actions} param0.actions
 * @returns {{
 *   state: Selectors,
 *   Provider: React.ComponentType<{children: React.ReactNode}>,
 *   useSelector: (selector: (state:State) => State) => any,
 *   useSetState: (() => (updater: (state: State) => State) => void)
 *   useActions: () => Actions
 * }}
 */
export function createStore({
  state: initState = {},
  selector = {},
  actions = {},
}) {
  const StoreContext = createContext();

  function StateKeeper({ initState }) {
    const context = useContext(StoreContext);
    const [state, setState] = useState(initState);
    context.state = state;

    useMemo(() => {
      context.setState = setState;
      const keys = Object.keys(actions);
      keys.forEach((key) => {
        context.actions[key] = (...args) => {
          context.setState((state) => actions[key](state, ...args));
        };
      });
    }, []);

    useEffect(() => {
      const keys = Object.keys(context.callbacks);
      keys.forEach((uuid) => {
        const [selector, prevValue, updater] = context.callbacks[uuid];
        const newValue = selector(state);
        newValue !== prevValue && updater();
      });
    }, [state]);

    return null;
  }

  const Provider = ({ children, initState: providerInitState }) => {
    const value = useMemo(
      () => ({ callbacks: {}, uuid: 0, state: {}, actions: {} }),
      []
    );
    return (
      <StoreContext.Provider value={value}>
        <StateKeeper initState={providerInitState ?? initState} />
        {children}
      </StoreContext.Provider>
    );
  };

  const useSelector = (selector) => {
    const context = useContext(StoreContext);
    const [, setKey] = useState(false);
    const uuid = useMemo(() => context.uuid++, []);
    const callbackRef = useRef();
    callbackRef.current = useMemo(() => {
      return [selector, selector(context.state), () => setKey((bool) => !bool)];
    }, [selector, uuid]);
    context.callbacks[uuid] = callbackRef.current;

    useEffect(() => {
      context.callbacks[uuid] = callbackRef.current;
      return () => {
        delete context.callbacks[uuid];
      };
    }, []);
    return selector(context.state);
  };

  const state = { ...selector };
  Object.keys(state).map((key) => {
    state[key] = () => {
      return useSelector(selector[key]);
    };
  });

  return {
    state,
    Provider,
    useSelector,
    useSetState: () => useContext(StoreContext).setState,
    useActions: () => useContext(StoreContext).actions,
  };
}
