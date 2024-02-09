function createTextNode(nodeValue) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue,
      children: []
    }
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child;
      })
    }
  };
}

function updateProps(dom, props) {
  props &&
    Object.keys(props).forEach(key => {
      if (key !== 'children') {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, props[key]);
          dom.addEventListener(eventType, props[key]);
        } else {
          dom[key] = props[key];
        }
      }
    });
}

function initChildren(fiber, children) {
  let prevChild = null;
  children.forEach((child, i) => {
    let newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      sibling: null,
      child: null,
      dom: null
    };
    if (i === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}
function updateFunctionComponent(fiber) {
  if (!fiber) return;
  const children = [fiber.type()];
  initChildren(fiber, children);
}

//处理普通组件
function updateHostComponent(fiber) {
  //notes  1.创建dom
  if (!fiber.dom) {
    fiber.dom = createDom(fiber.type);
    const dom = fiber.dom;
    //notes  2.设置props
    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  initChildren(fiber, children);
}
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) return fiber.child; //子节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

let nextWorkOfUnit = null;
let root = null;
function workLoop(deadLine) {
  let shouldYeld = false;
  while (!shouldYeld && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    // console.log(deadLine.timeRemaining());
    shouldYeld = deadLine.timeRemaining() < 5;
  }

  if (!nextWorkOfUnit && root) {
    commitRoot();
  }

  // requestIdleCallback(workLoop);
  nextWorkOfUnit && requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.dom) {
    //初始化创建时,挂载节点
    fiberParent?.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function render(el, container) {
  // 初始化时 #root 为真实dom，再包装成vDom后使用
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  };
  root = nextWorkOfUnit;
}

const React = {
  render,
  createElement
};

export default React;
