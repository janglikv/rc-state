import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "../src";

const store = createStore({
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
});

function Test() {
  return (
    <store.Provider>
      <Test2 />
    </store.Provider>
  );
}

function Test2() {
  const count = store.state.useCount();
  const actions = store.useActions();
  return (
    <div>
      <span>{count}</span>
      <button onClick={actions.increment}>+</button>
    </div>
  );
}

ReactDOM.render(<Test />, document.getElementById("app"));
