const demoStore = createStore({
    state: { count: 10 },
    selector: {
        useCount: (state) => state.count,
        useDoubledCount: (state) => state.count * 2,
    },
    actions: {
        increment: (state) => ({ ...state, count: state.count + 1 }),
        decrement: (state) => ({ ...state, count: state.count - 1 }),
    },
});

function Counter() {
    const count = demoStore.useSelector((state) => state.count);
    const doubledCount = demoStore.selector.useDoubledCount();
    return `${count} x 2 = ${doubledCount}`;
}

function CounterOptions() {
    const actions = demoStore.useActions();
    return (
        <>
            <button onClick={actions.decrement}>-</button>
            <button onClick={actions.increment}>+</button>
        </>
    );
}
