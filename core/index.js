import { effectWatch } from "./reactivity/index.js";
import { diff, mountElement } from "./renderer/index.js";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const context = rootComponent.setup();
      let isMounted = false;
      let prevSubtree;
      effectWatch(() => {
        if (!isMounted) {
          isMounted = true;
          const subTree = rootComponent.render(context);
          mountElement(subTree, rootContainer);
          prevSubtree = subTree;
        } else {
          const newSubTree = rootComponent.render(context);
          diff(prevSubtree, newSubTree);
          prevSubtree = newSubTree;
        }
      });
    },
  };
}
