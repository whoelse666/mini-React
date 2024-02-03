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

/* 创建 fiber以及儿子节点之间指针 结构，index =0 child ，index>1 则为child的sibling */
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
      // prevChild = fiber.child
    } else {
      prevChild.sibling = newFiber;
      // prevChild = prevChild.sibling
    }
    prevChild = newFiber;
  });
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function updateFunctionComponent(fiber) {
  // console.log('tagType', isFunctionCom, fiber.type());
  // console.log('tagType', fiber.type(fiber.props));
  // const type = fiber.type().type;
  // dom = type === 'TEXT_ELEMENT' ? document.createTextNode(fiber.nodeVal) : document.createElement(type);
  // // fiber.type = type;
  // // console.log(' fiber', fiber);
  // console.log(fiber.type(fiber.props).props.children);
  // console.log(fiber.type(fiber.props));
  // // fiber.props.children = [fiber.type(fiber.props)];
  // // fiber.props.children = fiber.type(fiber.props).props.children;

  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

let nextWorkOfUnit = null;
let isInit = 1;
function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (!isFunctionComponent) {
    updateHostComponent(fiber);
  } else {
    updateFunctionComponent(fiber);
  }
  let fiberParent = isInit ? fiber : fiber.parent;
  isInit = 0;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  fiberParent?.dom.append(fiber.dom);

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  if (fiber.child) {
    return fiber.child;
  }
}

function workLoop(deadLine) {
  let shouldYeld = false;
  while (!shouldYeld && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYeld = deadLine.timeRemaining() < 5;
  }
  // requestIdleCallback(workLoop);
  nextWorkOfUnit && requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function render(el, container) {
  // 初始化时 #root 为真实dom，再包装成vDom后使用
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  };
}

const React = {
  render,
  createElement
};

export default React;
