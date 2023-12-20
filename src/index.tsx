import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export { createStore2 } from './createStore2'



export function createStore<
  State,
  Selector extends Record<string, (state: State) => any>,
  Actions extends Record<string, (state: State, ...payload: any) => State>
>({
  state: initState,
  selector,
  actions,
}: {
  state: State,
  selector: Selector,
  actions: Actions
}) {
  const StoreContext = createContext<any>({});

  function StateKeeper({ initState }: any) {
    const context = useContext(StoreContext);
    const [state, setState] = useState(initState);
    context.state = state;

    useMemo(() => {
      context.setState = setState;
      const keys = Object.keys(actions as any);
      keys.forEach((key) => {
        context.actions[key] = (...args: any) => {
          context.setState((state: any) =>
            (actions as any)[key](state, ...args)
          );
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

  const Provider = ({ children, initState: providerInitState }: any) => {
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

  const useSelector = <S extends (state: State) => any>(selector: S) => {
    const context = useContext(StoreContext);
    const [, setKey] = useState(false);
    const uuid = useMemo(() => context.uuid++, []);
    const callbackRef = useRef<any>();
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

  const state = { ...selector } as Selector;
  Object.keys(state as any).map((key) => {
    (state as any)[key] = () => {
      return useSelector((selector as any)[key]);
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
