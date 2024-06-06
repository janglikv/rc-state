import React, {
    ComponentType,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

export function createStore<
    State,
    Selector extends Record<string, (state: State) => any>,
    Actions extends Record<string, (state: State, ...payload: any) => State>,
    Others extends Record<string, any> = {},
>({ state, selector, actions, useData, ...others }: { state?: State; selector?: Selector; useData?: Function, actions?: Actions } & Others) {
    actions = actions || ({} as any);
    selector = selector || ({} as any);
    const StoreContext = createContext<any>({ state, uuid: 0, callbacks: {}, actions, setState() { } });

    function StateKeeper({ initState }: any) {
        const context = useContext(StoreContext);
        const state = useRef(initState);

        const setState = useCallback((newState: any) => {
            if (typeof newState === 'function') {
                state.current = newState(state.current);
            } else {
                state.current = newState;
            }
            context.state = state.current;
            const keys = Object.keys(context.callbacks);
            keys.forEach((uuid) => {
                if (!context.callbacks[uuid]) {
                    return
                }
                const [selector, prevValue, updater] = context.callbacks[uuid];
                const newValue = selector(state.current);
                newValue !== prevValue && updater();
            });
        }, []);

        useEffect(() => {
            setState(initState);
        }, []);

        // init actions
        useMemo(() => {
            context.setState = setState;
            const keys = Object.keys(actions || {});
            keys.forEach((key) => {
                context.actions[key] = (...args: any) => {
                    context.setState((state: any) => (actions as any)[key](state, ...args));
                };
            });
        }, []);

        return null;
    }

    const AutoUse = ({ useData }: { useData: Function }) => {
        useData();
        return null;
    }

    const Provider = ({ children, initState }: { children: any; initState?: State | ((state?: State) => State) }) => {
        const value = useMemo(() => ({ callbacks: {}, uuid: 0, state: {}, actions: {} }), []);
        initState = initState instanceof Function ? initState(state) : initState;
        initState = initState ?? state;
        return (
            <StoreContext.Provider value={value}>
                {(typeof useData === 'function') && <AutoUse useData={useData as Function} />}
                <StateKeeper initState={initState} />
                {children}
            </StoreContext.Provider>
        );
    };

    const useSelector = <S extends (state: State) => ReturnType<S>>(selector: S) => {
        const context = useContext(StoreContext);
        const [, setKey] = useState(false);
        const uuid = useMemo(() => context.uuid++, []);
        const callbackRef = useRef<any>();
        callbackRef.current = useMemo(() => [selector, selector(context.state), () => setKey((bool) => !bool)], [selector, uuid]);
        context.callbacks[uuid] = callbackRef.current;

        useEffect(() => {
            context.callbacks[uuid] = callbackRef.current;
            return () => {
                delete context.callbacks[uuid];
            };
        }, []);

        return selector(context.state);
    };

    type RestParameters<T> = T extends (first: any, ...rest: infer R) => any ? R : never;
    type ActionFunctions = { [K in keyof Actions]: (...args: RestParameters<Actions[K]>) => void; };
    const useActions = () => {
        const context = useContext(StoreContext);
        const newActions: ActionFunctions = context.actions as ActionFunctions;
        return newActions;
    };

    type UseSelectors = {
        [K in keyof Selector]: () => ReturnType<Selector[K]>;
    };
    const useSelectors: UseSelectors = {
        ...selector,
    } as unknown as UseSelectors;

    Object.keys(useSelectors || {}).map((key) => {
        const selectorFunc = (useSelectors as any)[key];
        (useSelectors as any)[key] = () => useSelector(selectorFunc);
    });

    type UseStoreContext = {
        setState: React.Dispatch<React.SetStateAction<State>>;
        getState: () => State;
    };
    const useStoreContext = (): UseStoreContext => {
        const context = useContext(StoreContext);
        return useMemo(() => {
            return {
                setState: (...args) => context.setState(...args),
                getState: () => context.state,
            };
        }, []);
    };

    const StoreContextConsumer = ({ children }: { children: any }) => {
        const ctx = useStoreContext()
        return children(ctx)
    }

    return {
        Provider,
        state: useSelectors,
        useSelector,
        useActions,
        useContext: useStoreContext,
        StoreContextConsumer,
        withProvider: <T,>(Component: T, initState?: State | ((state?: State) => State)): T => {
            return ((props: any) => {
                const EComponent = Component as unknown as ComponentType<any>;
                return (
                    <Provider initState={initState}>
                        <StoreContextConsumer>
                            {(storeContext: any) => <EComponent {...props} storeContext={storeContext} />}
                        </StoreContextConsumer>
                    </Provider>
                );
            }) as unknown as T;
        },
        withContext: <T,>(Component: T): T => {
            return ((props: any) => {
                const storeContext = useStoreContext();
                const EComponent = Component as unknown as ComponentType<any>;
                return <EComponent {...props} storeContext={storeContext} />;
            }) as unknown as T;
        },
        ...others
    };
}
