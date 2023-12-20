export function createStore2<
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
    actions: Actions
}) {
    const useSelector = <S extends (state: State) => any>(selector: S) => {
        return () => selector(state);
    }

    const useActions = () => {
        type RestParameters<T> = T extends (first: any, ...rest: infer R) => any ? R : never;

        type ActionFunctions = {
            [K in keyof Actions]: (...args: RestParameters<Actions[K]>) => void;
        };


        const newActions: ActionFunctions = {} as ActionFunctions;

        (Object.keys(actions) as Array<keyof Actions>).forEach((key) => {
            newActions[key] = (...args: any[]) => {
                state = actions[key](state, ...args);
            };
        });

        return newActions;
    }

    return {
        state: selector,
        useSelector,
        useActions,
    }
}
