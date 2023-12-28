## install

### yarn

```bash
yarn add rc-state
```

### npm

```bash
npm install rc-state --save
```

## Component Feature Highlights

-   **Optimized React Context**: Enhanced performance, reduces unnecessary renderings.
-   **Selector Mechanism**: Precise state subscription, avoids redundant updates.
-   **TypeScript Support**: Ensures type safety and robustness of code.

### min demo

```javascript
const demoStore = createStore({ state: { say: 'hello', name: 'rc-state' } });

const DemoApp = demoStore.withProvider(function () {
    const name = demoStore.useSelector((state) => state.name);
    const say = demoStore.useSelector((state) => state.say);
    const { setState } = demoStore.useContext();
    const changeName = (e) => setState((state) => ({ ...state, name: e.target.value }));
    return (
        <div>
            {say} {name}!
            <br />
            <input value={name} onChange={changeName} />
        </div>
    );
});
```

### store.Customer demo

```javascript
const demo2Store = createStore({
    state: { say: 'hello', name: 'rc-state' },
    actions: {
        changeNameFromEvent: (state, event) => ({ ...state, name: event.target.value }),
    },
});

export const Demo2App = demo2Store.withProvider(function () {
    return (
        <>
            <demo2Store.Consumer selectors={[(state) => state.say, (state) => state.name]}>
                {({ values: [say, name], actions }) => {
                    return (
                        <>
                            {say} {name}!
                            <br />
                            <input value={name} onChange={actions.changeNameFromEvent} />
                        </>
                    );
                }}
            </demo2Store.Customer>
        </>
    );
});
```

### api

-   **createStore(options = {state, select?, actions?})**: create a store.
-   `options.state`: initial state, eg: `{ name: 'rc-state' }`.
-   `options.selector`: selector function, eg: `{useName: (state) => state.name,...}`, must start with `use`.
-   `options.actions`: updater function, eg: `(state) => ({ ...state, name: 'rc-state' })`.
-   `store.Provider` or `store.withProvider`: wrap the component with a provider.
-   `store.useContext`: get the context object of the store, which contains `getState`, `setState`.
-   `store.useSelector`: get the state of the store, and subscribe to changes in the state.
-   `store.useActions`: get the updater function of the store, form `options.actions`.
-   `store.state.use...`: get the selector function of the store, form `options.selector`.
-   `store.Consumer`: wrap the component with a consumer. see `store.Customer demo`.

## License

MIT
