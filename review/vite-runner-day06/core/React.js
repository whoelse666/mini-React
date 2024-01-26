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
let deletions = [];

function workLoop(deadline) {
  let shouldYield = false; //是否需要暂停次任务
  while (!shouldYield && nextWorkOfUnit) {
    //每次处理完后返回下一个节点,先找 child ,没有child再找sibling,再找父节点的sibling,知道最后一个节点,返回null
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
  //notes  4.返回下一个任务 (子节点 or 兄弟节点 or (向上一级)找-> 父节点的兄弟节点)
  if (fiber.child) return fiber.child; //子节点
  if (fiber.sibling) return fiber.sibling; //兄弟节点
  return fiber.parent?.sibling; //父节点的兄弟节点
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }
}
// fiberRoot 初始化时就是wipRoot
function commitRoot(fiberRoot) {
  deletions.forEach(commitDeletion);
  deletions = [];
  commitWork(fiberRoot.child);
  currentRoot = fiberRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    //向上查找有效父节点,挂在当前节点到父节点,函数组属于件特殊组件
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === 'update') {
    // todo 这里更新dom会有null情况,导致报错
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === 'placement') {
    //初始化创建时,挂载节点
    if (fiber.dom) {
      fiberParent?.dom.append(fiber.dom);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

//处理函数组件
function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

//处理普通组件
function updateHostComponent(fiber) {
  //notes  1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    //notes  2.设置props
    updateProps(dom, fiber.props, {});
    // fiber.parent?.dom.append(dom);
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

/* 
reconcileChildren function 
转换dom树为链表结构
创建： 初始化是创建节点指针关系
更新： 比对新旧之间变化，更新节点信息 
*/
function reconcileChildren(fiber, children) {
  //notes  3.转换链表,建立指针连接
  let prevChild = null;
  let oldFiber = fiber.alternate?.child;
  children &&
    children.forEach((child, index) => {
      const isSameType = oldFiber && oldFiber.type === child.type;
      let newFiber;
      if (isSameType) {
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
        if (child) {
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
        if (oldFiber) {
          deletions.push(oldFiber);
        }
      }
      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }
      if (index === 0) {
        fiber.child = newFiber;
      } else {
        prevChild.sibling = newFiber;
      }
      if (newFiber) prevChild = newFiber;
    });
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateProps(dom, nextProps, prevProps) {
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        // 旧的属性，在新的节点里没有，所以疝出属性
        dom.removeAttribute(key);
      }
    }
  });

  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventType = key.slice(2).toLowerCase();
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
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
