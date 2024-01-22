const createTextNode = nodeValue => ({ type: 'TEXT_ELEMENT', props: { nodeValue } });
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // children: children.map(child => (typeof child === 'string' ? createTextNode(child) : child)),
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child;
      })
    }
  };
}

let root = null;
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false; //是否需要暂停次任务
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1; //剩余时间小于 1,就暂停
  }
  if (!nextWorkOfUnit && root) {
    commitRoot(root);
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performWorkOfUnit(fiber) {
  // const isFunctionComponent = typeof fiber.type === 'function';

  if (typeof fiber.type === 'function') {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  //notes  4.返回下一个任务 (子节点 or 兄弟节点)
  if (fiber.child) return fiber.child;
  if (fiber.sibling) return fiber.sibling;
  return fiber.parent?.sibling;
}

function commitRoot(fiberRoot) {
  //  console.log('rootDom', rootDom);
  commitWork(fiberRoot.child);
  root = null;
}
function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  fiber.dom && fiberParent?.dom.append(fiber.dom);
  fiber.child && commitWork(fiber.child);
  fiber.sibling && commitWork(fiber.sibling);
}

//处理函数组件
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

//处理普通组件
function updateHostComponent(fiber) {
  //notes  1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    //notes  2.设置props
    updateProps(dom, fiber.props);
    // fiber.parent?.dom.append(dom);
  }

  const children = fiber.props?.children;
  initChildren(fiber, children);
}

function initChildren(fiber, children) {
  //notes  3.转换链表,建立指针连接
  let prevChild = null;
  // const children = fiber.props.children;
  children &&
    children.forEach((child, index) => {
      const newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        sibling: null,
        dom: null,
        child: null
      };
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevChild.sibling = newFiber;
      }
      prevChild = newFiber;
    });
}
function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key];
    }
  });
}

function createDom(type) {
  console.log('type', type);
  if (type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
  }
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

  /*  const dom = createDom(el.type);
  updateProps(dom, el.props);
  const children = el.props.children;
  children && children.forEach(child => render(child, dom));
  container.append(dom); */
}

const React = {
  render,
  createElement
};

export default React;
