export function h(tag, props, children) {
  return {
    tag,
    props,
    children: Array.isArray(children) ? children : String(children),
  };
}
