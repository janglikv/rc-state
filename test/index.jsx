import React from "react";
import ReactDOM from "react-dom";
import { createStore as createSrcStore } from "../src";
import { createStore } from "../lib";

/** @type {import("../src").StoreOptions} */
const data = {
  state: {
    count: 0,
  },
  selector: {
    useCount: (state) => state.count,
  },
  actions: {
    increment(state) {
      return {
        count: state.count + 1,
      };
    },
  },
};

const srcStore = createSrcStore(data);
const libStore = createStore(data);


function App({ store }) {
  const count = store.state.useCount();
  const actions = store.useActions();
  return (
    <div style={{ zoom: 2 }}>
      <input value={count} style={{ marginRight: 6 }} />
      <button onClick={actions.increment}>+</button>
    </div>
  );
}

function AppRoot() {
  return (
    <div style={{ fontSize: 16, lineHeight: 2, padding: 24 }}>
      <div>src Store</div>
      <srcStore.Provider>
        <App store={srcStore} />
      </srcStore.Provider>
      <br />
      <div>lib Store</div>
      <libStore.Provider>
        <App store={libStore} />
      </libStore.Provider>
    </div>
  );
}

ReactDOM.render(<AppRoot />, document.getElementById("app"));
