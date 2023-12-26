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

### api

-   **createStore(options = {state, select?, actions?})**: create a store.
-   `options.state`: initial state, eg: `{ name: 'rc-state' }`.
-   `options.select`: selector function, eg: `(state) => state.name`.
-   `options.actions`: updater function, eg: `(state) => ({ ...state, name: 'rc-state' })`.
-   `store.Provider` or `store.withProvider`: wrap the component with a provider.
-   `store.useContext`: get the context object of the store, which contains `getState`, `setState`.
-   `store.useSelector`: get the state of the store, and subscribe to changes in the state.
-   `store.useActions`: get the updater function of the store, form options.actions.
