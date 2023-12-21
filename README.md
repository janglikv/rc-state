### Component Feature Highlights

- **Optimized React Context**: Enhanced performance, reduces unnecessary renderings.
- **Selector Mechanism**: Precise state subscription, avoids redundant updates.
- **TypeScript Support**: Ensures type safety and robustness of code.

```javascript
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
```

```javascript
export default function DemoApp() {
    return (
        <demoStore.Provider>
            <Counter />
            <br />
            <CounterOptions />
        </demoStore.Provider>
    );
}
```

```javascript
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
```
