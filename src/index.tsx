import React, { ComponentType, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

export function createStore<
    State,
    Selector extends Record<string, (state: State) => any>,
    Actions extends Record<string, (state: State, ...payload: any) => State>,
>({ state, selector, actions }: { state?: State; selector?: Selector; actions?: Actions }) {
    actions = actions || ({} as any);
    selector = selector || ({} as any);
    const StoreContext = createContext<any>({});

    function StateKeeper({ initState }: any) {
        const context = useContext(StoreContext);
        const [state, setState] = useState(initState);
        context.state = state;

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

        // toggle selectors updater when state changed
        useMemo(() => {
            const keys = Object.keys(context.callbacks);
            keys.forEach((uuid) => {
                const [selector, prevValue, updater] = context.callbacks[uuid];
                const newValue = selector(state);
                newValue !== prevValue && updater();
            });
        }, [state]);

        return null;
    }

    const Provider = ({ children, initState }: { children: any; initState?: State }) => {
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
        return {
            setState: context.setState,
            getState: context.state,
        };
    };

    return {
        Provider,
        selector: useSelectors,
        useSelector,
        useActions,
        useContext: useStoreContext,
        withProvider: <T,>(Component: T): T => {
            return ((props: any) => {
                const EComponent = Component as unknown as ComponentType<any>;
                return (
                    <Provider>
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
            children?: ({}: { values: any[]; actions: ActionFunctions; context: UseStoreContext }) => any;
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
