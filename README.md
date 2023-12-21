```javascript
const demoStore = createStore({
  state: { count: 10 },
  selector: {
    useCount: (state) => state.count,
    useDoubledCount: (state) => state.count * 2,
  },
  actions: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    },
  },
});
```

```javascript
export default function DemoApp() {
  return (
    <demoStore.Provider>
      <Counter />
      <br />
      <CounterInput />
      <CounterOptions />
    </demoStore.Provider>
  );
}
```

```javascript
function Counter() {
  const count = demoStore.useSelector((state) => state.count);
  const doubledCount = demoStore.state.useDoubledCount();
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

function CounterInput() {
  const count = demoStore.useSelector((state) => state.count);
  const setState = demoStore.useSetState();
  return (
    <input
      type="number"
      value={count}
      onChange={(e) => {
        setState((state) => ({ ...state, count: +e.target.value }));
      }}
    />
  );
}
```
