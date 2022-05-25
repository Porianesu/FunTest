type IsNullAble<T> = T | null | undefined;
type EffectTag = "UPDATE" | "PLACEMENT" | "DELETION";
type DidacticAction<T> = (state: T) => T;
type DidacticUseState = <T>(
  initial: T
) => [T, (action: T | DidacticAction<T>) => void];
interface DidacticHook {
  state: any;
  queue: Array<DidacticAction<any>>;
}
interface DidacticFiber {
  type?: string | Function;
  dom: IsNullAble<HTMLElement | Text>;
  parent?: IsNullAble<DidacticFiber>;
  child?: IsNullAble<DidacticFiber>;
  sibling?: IsNullAble<DidacticFiber>;
  props: any;
  alternate: IsNullAble<DidacticFiber>;
  effectTag?: EffectTag;
  hooks?: Array<DidacticHook>;
}
const createTextElement: (text: string) => DidacticFiber = (text) => {
  return {
    type: "TEXT_ELEMENT",
    dom: null,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    props: {
      nodeValue: text,
      children: [],
    },
  };
};
const createElement: (
  type: string,
  props: any,
  ...children: Array<any>
) => DidacticFiber = (type, props, ...children) => {
  return {
    type,
    dom: null,
    parent: null,
    child: null,
    sibling: null,
    alternate: null,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
};
const createDom: (fiber: DidacticFiber) => HTMLElement | Text = (fiber) => {
  let dom: Text | HTMLElement;
  if (fiber.type === "TEXT_ELEMENT") {
    dom = document.createTextNode(fiber.props.nodeValue);
  } else {
    dom = document.createElement(fiber.type as string);
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name: string) => {
        dom[name] = fiber.props[name];
      });
  }
  // 添加监听事件
  Object.keys(fiber.props)
    .filter(isEvent)
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, fiber.props[name]);
    });
  return dom;
};
const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: any) => key !== "children" && !isEvent(key);
const isNew =
  (prev: { [x: string]: any }, next: { [x: string]: any }) => (key: string) =>
    prev[key] !== next[key];
const isGone = (prev: any, next: any) => (key: string) => !(key in next);
const updateDom = (dom: any, prevProps: any, nextProps: any) => {
  // 移除旧的或者已经改变了的监听事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });
  // 移除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => (dom[name] = ""));
  // 设置新属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => (dom[name] = nextProps[name]));
  // 添加新的监听事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
};
const commitRoot = () => {
  deletions?.forEach(commitWork);
  commitWork(wipRoot?.child);
  currentRoot = wipRoot;
  wipRoot = null;
};
const commitWork: (fiber: IsNullAble<DidacticFiber>) => void = (fiber) => {
  if (!fiber) return;
  // 为了适配函数式组件，改为从dom树向上寻找指导有一个dom节点作为domParent
  let domParentFiber = fiber.parent;
  while (!domParentFiber?.dom) {
    domParentFiber = domParentFiber?.parent;
  }
  const domParent = domParentFiber.dom;
  if (fiber.dom) {
    if (fiber.effectTag === "PLACEMENT") {
      domParent?.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE") {
      updateDom(fiber.dom, fiber.alternate?.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      commitDeletion(fiber, domParent);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};
const commitDeletion: (
  fiber: DidacticFiber,
  domParent: HTMLElement | Text
) => void = (fiber, domParent) => {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    if (fiber.child) {
      commitDeletion(fiber.child, domParent);
    }
  }
};
const render = (element: DidacticFiber, container: HTMLElement) => {
  wipRoot = nextUnitOfWork = {
    type: container.nodeName.toLowerCase(),
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
    parent: null,
    child: null,
    sibling: null,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
};
let nextUnitOfWork: IsNullAble<DidacticFiber> = null;
let currentRoot: IsNullAble<DidacticFiber> = null;
let wipRoot: IsNullAble<DidacticFiber> = null; // work in progress root
let deletions: IsNullAble<Array<DidacticFiber>> = null;
const performUnitOfWork: (fiber: DidacticFiber) => IsNullAble<DidacticFiber> = (
  fiber
) => {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    if (nextFiber.parent) {
      nextFiber = nextFiber.parent;
    } else {
      // R如果不存在父节点则认为遍历结束，直接跳出
      return null;
    }
  }
};
let wipFiber: DidacticFiber;
let hookIndex: number;
const updateFunctionComponent: (fiber: DidacticFiber) => void = (fiber) => {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [(fiber.type as Function)(fiber.props)];
  reconcileChildren(fiber, children);
};
const useState: DidacticUseState = (initial) => {
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook: DidacticHook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };
  const actions = oldHook?.queue || [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });
  wipFiber.hooks?.push(hook);
  hookIndex++;
  const setState = (
    action: typeof initial | DidacticAction<typeof initial>
  ) => {
    const finalAction = action instanceof Function ? action : () => action;
    hook.queue.push(finalAction);
    // workInProgressRoot
    wipRoot = {
      dom: currentRoot?.dom,
      props: currentRoot?.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };
  return [hook.state, setState];
};
const updateHostComponent: (fiber: DidacticFiber) => void = (fiber) => {
  //add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  //create new fibers
  if (fiber.type !== "TEXT_ELEMENT") {
    const elements = fiber.props.children;
    reconcileChildren(fiber, elements);
  }
};
const reconcileChildren = (
  wipFiber: DidacticFiber,
  elements: string | any[]
) => {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  if (elements) {
    while (index < elements.length || oldFiber) {
      const element = elements[index];
      const elementType = Object.prototype.toString.call(element);
      let newFiber: IsNullAble<DidacticFiber> = null;
      // 比较旧fiber和element
      let sameType = false;
      if (oldFiber && element) {
        if (elementType === "[object Object]") {
          sameType = oldFiber.type === element.type;
        } else {
          sameType = oldFiber.type === "TEXT_ELEMENT";
        }
      }
      if (sameType) {
        // 更新节点
        if (elementType === "[object Object]") {
          newFiber = {
            type: element.type,
            props: element.props,
            dom: oldFiber?.dom || null,
            parent: wipFiber,
            child: null,
            sibling: null,
            alternate: oldFiber,
            effectTag: "UPDATE",
          };
        } else {
          newFiber = {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: element,
            },
            dom: oldFiber?.dom || null,
            parent: wipFiber,
            child: null,
            sibling: null,
            alternate: oldFiber,
            effectTag: "UPDATE",
          };
        }
      }
      if (element && !sameType) {
        // 添加到节点上
        if (elementType === "[object Object]") {
          newFiber = {
            type: element.type,
            props: element.props,
            dom: null,
            parent: wipFiber,
            child: null,
            sibling: null,
            alternate: null,
            effectTag: "PLACEMENT",
          };
        } else {
          newFiber = {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: element,
            },
            dom: null,
            parent: wipFiber,
            child: null,
            sibling: null,
            alternate: null,
            effectTag: "PLACEMENT",
          };
        }
      }
      if (oldFiber && !sameType) {
        debugger;
        // 删除旧节点
        oldFiber.effectTag = "DELETION";
        deletions?.push(oldFiber);
      }
      // 第一个元素变为父Fiber的child节点，然后赋给prevSibling，之后的每一个元素都赋给前一个元素的sibling
      if (index === 0) {
        wipFiber.child = newFiber;
      } else if (element) {
        if (prevSibling) {
          prevSibling.sibling = newFiber;
        }
      }
      prevSibling = newFiber;
      oldFiber = oldFiber?.sibling;
      index++;
    }
  }
};
const workLoop: IdleRequestCallback = (deadline) => {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  // 此时完成了所有的unitWork且根节点存在
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
};
requestIdleCallback(workLoop);
const Didactic = { createElement, render, useState };

export default Didactic;
