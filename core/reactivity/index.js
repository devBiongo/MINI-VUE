class Dep {
  constructor() {
    this.effects = new Set();
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect);
    }
  }

  notice() {
    this.effects.forEach((effect) => {
      effect();
    });
  }
}

function getDep(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Dep();
    depsMap.set(key, dep);
  }
  return dep;
}

let currentEffect;
const targetMap = new Map();

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key);
      dep.depend();
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      const dep = getDep(target, key);
      const result = Reflect.set(target, key, value);
      dep.notice();
      return result;
    },
  });
}

export function effectWatch(effect) {
  currentEffect = effect;
  effect();
  currentEffect = null;
}
