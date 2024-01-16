function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
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
        const isFn = ['string', 'number'].includes(typeof child);
        return isFn ? createTextNode(child) : child;
      })
    }
  };
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  };
  root = nextWorkOfUnit;
  // requestIdleCallback(workLoop);
}
let root = null,
  nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWorkOfUnit && root) {
    // nextWorkOfUnit===null,表示链表结束，结束时统一提交
    commitRoot(root);
  }
  requestIdleCallback(workLoop);
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
}

function initChildren(fiber, children) {
  // const children = fiber.props.children; //拿到第一个 children,作为链表第一个点
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    };
    if (index === 0) {
      fiber.child = newFiber; // 链表的 head
    } else {
      prevChild.sibling = newFiber; // 保存当前节点的前一个节点用于建立指针到下一个
    }
    prevChild = newFiber; // 更新 prevChild
  });
}

function commitRoot(root) {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  fiber.dom && fiberParent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 处理函数组件
function updateFunctionComponent(fiber) {
  //  转换结构- 链表
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

// 处理普通元素
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1. 创建 Dom
    const dom = (fiber.dom = createDom(fiber.type));
    // 2. 处理 props
    updateProps(dom, fiber.props);
  }
  const children = fiber.props.children;
  initChildren(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunCom = typeof fiber.type === 'function';

  if (isFunCom) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  // 3.转换结构- 链表
  const children = isFunCom ? [fiber.type(fiber.props)] : fiber.props.children;
  initChildren(fiber, children);

  //4.返回下一个执行 任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling; //父结点的兄弟节点

  /*  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  } */
}

// 函数将在浏览器空闲时期被调用
requestIdleCallback(workLoop);

const React = {
  render,
  createElement
};
export default React;
