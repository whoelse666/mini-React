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
        dom[key] = props[key];
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
  if (type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type?.type);
  }
}

function updateFunctionComponent(fiber) {
  if (!fiber) return;
  const children = [fiber.type()];
  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
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
  /*   if (!isFunctionComponent) {
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type));
      // fiber.parent?.dom.append(fiber.dom);
      updateProps(dom, fiber.props);
    }
  }
  const children = isFunctionComponent ? [fiber.type()] : fiber.props.children;
  fiber && initChildren(fiber, children);
  */

  /*   if (fiber.child) return fiber.child; //子节点
  if (fiber.sibling) return fiber.sibling; //兄弟节点
  return fiber.parent?.sibling; //父节点的兄弟节点 */

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
    fiberParent.dom.append(fiber.dom);
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
