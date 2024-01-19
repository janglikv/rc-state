import { createStore } from '../../src';

export const store = createStore({
    state: {},
    actions: {
        setValue: (state, name, value) => {
            return {
                ...state,
                [name]: { ...state[name], value },
            };
        },
    },
});
