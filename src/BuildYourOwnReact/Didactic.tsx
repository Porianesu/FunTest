type IsNullAble<T> = T | null | undefined;
type EffectTag = "UPDATE" | "PLACEMENT" | "DELETION";
type HTMLElementTagMap = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
interface DidacticNormalFiber {
  type: keyof HTMLElementTagNameMap;
  dom: HTMLElement | null;
  parent: IsNullAble<DidacticFiber>;
  child: IsNullAble<DidacticFiber>;
  sibling: IsNullAble<DidacticFiber>;
  props: {
    [Property in keyof HTMLElement]: HTMLElement[Property];
  };
  alternate: IsNullAble<DidacticFiber>;
  effectTag?: EffectTag;
}
interface DidacticTextFiber {
  type: "TEXT_ELEMENT";
  dom: HTMLElement | null;
  parent: IsNullAble<DidacticFiber>;
  child: IsNullAble<DidacticFiber>;
  sibling: IsNullAble<DidacticFiber>;
  props: {
    nodeValue: string;
  };
  alternate: IsNullAble<DidacticFiber>;
  effectTag?: EffectTag;
}
type DidacticFiber = DidacticNormalFiber | DidacticTextFiber;
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
const createDom: (fiber: DidacticFiber) => Node = (fiber) => {
  if (fiber.type === "TEXT_ELEMENT") {
    return document.createTextNode(fiber.props.nodeValue);
  } else {
    const dom = document.createElement(fiber.type);
    (Object.keys(fiber.props) as Array<keyof HTMLElementTagMap>)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = fiber.props[name];
      });
    return dom;
  }
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
const render = (element: DidacticFiber, container: HTMLElement) => {
  wipRoot = nextUnitOfWork = {
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
  //add dom node
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  //create new fibers
  if (fiber.type !== "TEXT_ELEMENT") {
    const elements = (fiber as DidacticNormalFiber).props.children;
    reconcileChildren(fiber, elements);
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
const reconcileChildren = (
  wipFiber: DidacticFiber,
  elements: string | any[]
) => {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  if (elements) {
    // 非文本节点
    if (Array.isArray(elements)) {
      while (index < elements.length || oldFiber !== null) {
        const element = elements[index];
        let newFiber: IsNullAble<DidacticFiber> = null;
        // 比较旧fiber和element
        const sameType = oldFiber && elements && element.type === oldFiber.type;
        if (sameType) {
          // 更新节点
          newFiber = {
            type: oldFiber?.type,
            props: element.props,
            dom: oldFiber?.dom || null,
            parent: wipFiber,
            child: null,
            sibling: null,
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
            child: null,
            sibling: null,
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
    } else {
      wipFiber.child = {
        type: "TEXT_ELEMENT",
        props: elements,
        dom: null,
        parent: wipFiber,
        child: null,
        sibling: null,
        alternate: null,
        effectTag: "PLACEMENT",
      };
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
const Didactic = { createElement, render };

export default Didactic;
