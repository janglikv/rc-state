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
>({ state, selector, actions }: { state?: State; selector?: Selector; actions?: Actions }) {
    actions = actions || ({} as any);
    selector = selector || ({} as any);
    const StoreContext = createContext<any>({ state, uuid: 0, callbacks: {}, actions });

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

    const Provider = ({ children, initState }: { children: any; initState?: State | ((state?: State) => State) }) => {
        const value = useMemo(() => ({ callbacks: {}, uuid: 0, state: {}, actions: {} }), []);
        initState = initState instanceof Function ? initState(state) : initState;
        initState = initState ?? state;
        return (
            <StoreContext.Provider value={value}>
                <StateKeeper initState={initState} />
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

    type RestParameters<T> = T extends (first: any, ...rest: infer R) => any ? R : never;
    type ActionFunctions = {
        [K in keyof Actions]: (...args: RestParameters<Actions[K]>) => void;
    };
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

    const useSelectorsList = Object.keys(useSelectors || {}).map((key) => {
        return (useSelectors as any)[key];
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

    return {
        Provider,
        state: useSelectors,
        useSelector,
        useActions,
        useContext: useStoreContext,
        withProvider: <T,>(Component: T, initState?: State | ((state?: State) => State)): T => {
            return ((props: any) => {
                const EComponent = Component as unknown as ComponentType<any>;
                return (
                    <Provider initState={initState}>
                        <EComponent {...props} />
                    </Provider>
                );
            }) as unknown as T;
        },
        Consumer: ({
            selectors = [],
            children,
        }: {
            selectors?: Array<(state: State) => any | UseSelectors>;
            children?: ({ }: { values: any[]; actions: ActionFunctions; context: UseStoreContext }) => any;
        }) => {
            const values = selectors.map((selector) => {
                if (useSelectorsList.includes(selector)) {
                    const useValue = selector as any;
                    return useValue();
                }
                return useSelector(selector);
            });
            const actions = useActions();
            const context = useStoreContext();
            return children?.({ values, actions, context }) ?? null;
        },
    };
}
