// work in progress root
let wipRoot, nextUnitOfWork, currentRootUnitOfWork, wipFiber;

export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = ['string', 'number'].includes(typeof child);
        return isTextNode ? createTextNode(child) : child;
      })
    }
  };
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });

  Object.entries(nextProps).forEach(([key, value]) => {
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
export function render(el, container) {
  wipRoot = {
    props: {
      children: [el]
    },
    dom: container,
    child: null,
    sibling: null,
    parent: null
  };
  nextUnitOfWork = wipRoot;
}

export function update() {
  const currentFiber = wipFiber;
  return () => {
    console.log('currentFiber', currentFiber);
    wipRoot = { ...currentFiber, alternate: currentFiber };

    /*     wipRoot = {
      props: currentRootUnitOfWork.props,
      dom: currentRootUnitOfWork.dom,
      child: null,
      sibling: null,
      parent: null,
      alternate: currentRootUnitOfWork
    }; */
    nextUnitOfWork = wipRoot;
  };
}

function workLoop(IdleDeadline) {
  let shouldYield = IdleDeadline.timeRemaining() < 1;

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
    if (nextUnitOfWork?.type === wipRoot?.sibling?.type) {
      console.log('nextUnitOfWork.type === wipRoot.sibling.type', wipRoot,nextUnitOfWork);
      nextUnitOfWork = null;
    }
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

let deletions = [];
function commitDeletions(fiber, index) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom && fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  }
}

function commitRoot() {
  deletions.forEach(commitDeletions);
  commitWork(wipRoot.child);
  currentRootUnitOfWork = wipRoot;
  wipRoot = null;
  deletions = [];
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(fiber, children) {
  let preChildFiber = null;
  let oldFiber = fiber.alternate?.child;

  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child?.type;
    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        dom: oldFiber.dom,
        child: null,
        sibling: null,
        parent: fiber,
        alternate: oldFiber,
        effectTag: 'update'
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          dom: null,
          child: null,
          sibling: null,
          parent: fiber,
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
      preChildFiber.sibling = newFiber;
    }
    if (newFiber) {
      preChildFiber = newFiber;
    }
  });
}

const React = {
  render,
  update,
  createElement
};

export default React;
