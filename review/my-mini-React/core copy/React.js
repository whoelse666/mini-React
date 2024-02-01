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

function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, i) => {
    console.log('child', child);
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

let nextWorkOfUnit = null;
function performWorkOfUnit(fiber) {
  console.log('fiber', fiber);
  if (!fiber.dom) {
    const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode(fiber.nodeVal) : document.createElement(fiber.type);
    fiber.dom = dom;
    fiber.parent?.dom.append(fiber.dom);
    console.log('   fiber.dom', fiber.dom);
    console.log('   fiber.parent', fiber.parent);
    updateProps(dom, fiber.props);
  }
  fiber && initChildren(fiber);
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

let loop = 1;

function workLoop(deadLine) {
  console.log('workLoop' + loop);
  loop++;
  let shouldYeld = false;
  while (!shouldYeld && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    console.log(deadLine.timeRemaining());
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
