import { h } from "./core/h.js";
import { reactive } from "./core/reactivity/index.js";

export const App = {
  render(context) {
    return h(
      "div",
      null,
      context.state.arrs.map((value) => h("p", { id: value }, value))
    );
  },
  setup() {
    const state = reactive({
      count: 0,
      arrs: [1, 2, 3],
    });
    window.state = state;
    return { state };
  },
};
