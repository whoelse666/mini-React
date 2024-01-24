/* 
自由实现,添加注释
*/
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

let root = null;
let prevRoot = null; //每次update 都更新, 保存每一次结束后新的链表数据,用以新旧对比(对应节点指针指向)
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
  commitWork(fiberRoot.child);
  prevRoot = root;
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

  const children = fiber.props.children;
  initChildren(fiber, children);
}




/* 
传入filer 递归建立指针关系
*/
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
        sibling: null, //建立兄弟节点指针
        dom: null,
        child: null //建立子节点指针
      };
      if (index === 0) {
      // 每一层第一个节点是fiber的第一个子节点，其他的是该节点的同层节点（兄弟节点）
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

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  };
  root = nextWorkOfUnit;
}

function update() {
  // nextWorkOfUnit 变化激活调用 workLoop , 在requestIdleCallback(workLoop)监听
  nextWorkOfUnit = {
    dom: prevRoot.dom,
    props: prevRoot.props,
    alternate: prevRoot
  };
  root = nextWorkOfUnit;
  // prevRoot = nextWorkOfUnit
}

const React = {
  render,
  update,
  createElement
};

export default React;
