export function diff(n1, n2) {
  if (n1.tag !== n2.tag) {
    const newElement = document.createElement(n2.tag);
    n2.el = newElement;
    n1.el.replaceWith(newElement);
  } else {
    const currentElement = (n2.el = n1.el);
    const { props: newProps } = n2;
    const { props: oldProps } = n1;
    if (newProps && oldProps) {
      for (const key in newProps) {
        const newVal = Reflect.get(newProps, key);
        const oldVal = Reflect.get(oldProps, key);
        if (newVal !== oldVal) {
          currentElement.setAttribute(key, newVal);
        }
      }
    }
    if (oldProps) {
      for (const key in oldProps) {
        if (!Reflect.get(newProps, key)) {
          currentElement.removeAttribute(key);
        }
      }
    }
    const { children: newChildren } = n2;
    const { children: oldChildren } = n1;
    if (typeof newChildren == "string") {
      if (typeof oldChildren == "string") {
        if (newChildren !== oldChildren) {
          currentElement.innerText = newChildren;
        }
      } else if (Array.isArray(oldChildren)) {
        currentElement.innerText = newChildren;
      }
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren == "string") {
        currentElement.innerText = "";
        for (const v of newChildren) {
          mountElement(v, currentElement);
        }
      } else if (Array.isArray(oldChildren)) {
        const length = Math.min(newChildren.length, oldChildren.length);
        for (let index = 0; index < length; index++) {
          const newVNode = Reflect.get(newChildren, index);
          const oldVNode = Reflect.get(oldChildren, index);
          diff(oldVNode, newVNode);
        }
        if (newChildren.length > length) {
          for (let index = length; index < newChildren.length; index++) {
            const newVNode = Reflect.get(newChildren, index);
            mountElement(newVNode, currentElement);
          }
        }

        if (oldChildren.length > length) {
          for (let index = length; index < oldChildren.length; index++) {
            const oldVNode = Reflect.get(oldChildren, index);
            currentElement.removeChild(oldVNode.el);
          }
        }
      }
    }
  }
}

export function mountElement(vNode, container) {
  const { tag, props, children } = vNode;
  const el = document.createElement(tag);
  vNode.el = el;
  if (props) {
    for (const key in props) {
      el.setAttribute(key, Reflect.get(props, key));
    }
  }
  if (typeof children == "string") {
    el.append(document.createTextNode(children));
  } else if (Array.isArray(children)) {
    for (const v of children) {
      mountElement(v, el);
    }
  }
  container.append(el);
}
