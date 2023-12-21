import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export function createStore<
  State,
  Selector extends Record<string, (state: State) => any>,
  Actions extends Record<string, (state: State, ...payload: any) => State>
>({
  state,
  selector,
  actions,
}: {
  state: State,
  selector: Selector,
  actions: Actions,
}) {
  actions = actions || {};
  selector = selector || {};
  const StoreContext = createContext<any>({});

  function StateKeeper({ initState }: any) {
    const context = useContext(StoreContext);
    const [state, setState] = useState(initState);
    context.state = state;

    // init actions
    useMemo(() => {
      context.setState = setState;
      const keys = Object.keys(actions);
      keys.forEach((key) => {
        context.actions[key] = (...args: any) => {
          context.setState((state: any) =>
            (actions as any)[key](state, ...args)
          );
        };
      });
    }, []);

    // toggle selectors updater when state changed
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

  const Provider = ({ children, initState }: {
    children: any,
    initState?: State
  }) => {
    const value = useMemo(() => ({ callbacks: {}, uuid: 0, state: {}, actions: {} }), []);
    return (
      <StoreContext.Provider value={value}>
        <StateKeeper initState={initState ?? state} />
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

    return selector(context.state)
  }

  const useActions = () => {
    const context = useContext(StoreContext);
    type RestParameters<T> = T extends (first: any, ...rest: infer R) => any ? R : never;
    type ActionFunctions = {
      [K in keyof Actions]: (...args: RestParameters<Actions[K]>) => void;
    };
    const newActions: ActionFunctions = context.actions as ActionFunctions;
    return newActions;
  }

  Object.keys(selector).map(key => {
    (selector as any)[key] = () => {
      return useSelector(selector[key]);
    };
  });

  return {
    Provider,
    selector,
    useSelector,
    useActions,
    useContext: () => {
      const context = useContext(StoreContext);
      return {
        setState: context.setState as React.Dispatch<React.SetStateAction<State>>,
        getState: () => context.state as State,
      }
    },
  }
}