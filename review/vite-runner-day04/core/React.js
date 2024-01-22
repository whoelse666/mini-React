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
        const isTextNode = typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      })
    }
  };
}

let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null;

function workLoop(deadline) {
  let shouldYield = false; //是否需要暂停次任务
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1; //剩余时间小于 1,就暂停
  }
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot(wipRoot);
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
  commitWork(fiberRoot.child);
  wipRoot = null;
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

  const children = fiber.props.children;
  initChildren(fiber, children);
}

function initChildren(fiber, children) {
  //notes  3.转换链表,建立指针连接
  let prevChild = null;
  const oldFiber = fiber.alternate.child;
  children &&
    children.forEach((child, index) => {
      let newFiber;
      if (isUpdate) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: oldFiber.dom,
          effectTag: 'update',
          alternate: oldFiber
        };
      } else {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'placement'
        };
      }

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
      if (key.startsWith('on')) {
        const eventType = key.slice(2).toLowerCase();
        dom.addEventListener(eventType, props[key]);
      } else {
        dom[key] = props[key];
      }
    }
  });
}

function createDom(type) {
  if (type) {
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
  }
}
function update() {
  console.log('update');
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  };

  nextWorkOfUnit = wipRoot;
}

function render(el, container) {
  wipRoot = {
    alternate: container,
    dom: container,
    props: {
      children: [el]
    }
  };
  nextWorkOfUnit = wipRoot;
}

const React = {
  render,
  update,
  createElement
};

export default React;
