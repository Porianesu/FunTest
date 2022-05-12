interface DidacticElement {
  type: string;
  props: {
    nodeValue?: string | number;
    children: Array<DidacticElement>;
  };
}
type IsNullAble<T> = T | null | undefined;
type EffectTag = "UPDATE" | "PLACEMENT" | "DELETION";
interface DidacticFiber {
  type?: string;
  dom: Node | null;
  parent?: DidacticFiber;
  child?: DidacticFiber;
  sibling?: DidacticFiber;
  props: {
    children: Array<any>;
  };
  alternate?: IsNullAble<DidacticFiber>;
  effectTag?: EffectTag;
}
const createTextElement: (text: string) => DidacticElement = (text) => {
  return {
    type: "TEXT_ELEMENT",
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
) => DidacticElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "object" ? child : createTextElement(child);
      }),
    },
  };
};
const createDom: (fiber: DidacticFiber) => Node = (fiber) => {
  const dom =
    fiber.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);
  const isProperty = (key: string) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = fiber.props[name];
    });
  return dom;
};
const isEvent = (key: string) => key.startsWith("on");
const isProperty = (key: string) => key !== "children" && !isEvent(key);
const isNew =
  (prev: { [x: string]: any }, next: { [x: string]: any }) => (key: string) =>
    prev[key] !== next[key];
const isGone = (prev: any, next: any) => (key: string) => !(key in next);
const updateDom = (
  dom: ParentNode,
  prevProps: ParentNode,
  nextProps: ParentNode
) => {
  // 移除旧的活着已经改变了的监听事件
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
};
const commitRoot = () => {
  deletions?.forEach(commitWork);
  commitWork(wipRoot?.child);
  currentRoot = wipRoot;
  wipRoot = null;
};
const commitWork: (fiber?: DidacticFiber) => void = (fiber) => {
  if (!fiber) return;
  const domParent = fiber.parent?.dom;
  if (fiber.dom) {
    if (fiber.effectTag === "PLACEMENT") {
      domParent?.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE") {
      updateDom(fiber.dom, fiber.alternate?.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
      domParent?.removeChild(fiber.dom);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
};
const render = (element: DidacticElement, container: Node) => {
  wipRoot = nextUnitOfWork = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
};
let nextUnitOfWork: IsNullAble<DidacticFiber> = null;
let currentRoot: IsNullAble<DidacticFiber> = null;
let wipRoot: IsNullAble<DidacticFiber> = null; // work in progress root
let deletions: IsNullAble<Array<DidacticFiber>> = null;
const performUnitOfWork: (fiber: DidacticFiber) => DidacticFiber | undefined = (
  fiber
) => {
  //add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  //create new fibers
  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);
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
    }
  }
};
const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  while (index < elements.length || oldFiber !== null) {
    const element = elements[index];
    let newFiber: IsNullAble<DidacticFiber> = null;
    // 比较旧fiber和element
    const sameType = oldFiber && elements && element.type === oldFiber.type;
    if (sameType) {
      // 更新节点
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    if (element && !sameType) {
      // 添加到节点上
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }
    if (oldFiber && !sameType) {
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
    index++;
  }
};
const workLoop = (deadline) => {
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
const Didactic = { createElement, render };
export default Didactic;
