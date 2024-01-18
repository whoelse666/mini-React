// work in progress root
let wipRoot;
let nextUnitOfWork;
let currentRootUnitOfWork;

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
  wipRoot = {
    props: currentRootUnitOfWork.props,
    dom: currentRootUnitOfWork.dom,
    child: null,
    sibling: null,
    parent: null,
    alternate: currentRootUnitOfWork
  };
  nextUnitOfWork = wipRoot;
}

function workLoop(IdleDeadline) {
  let shouldYield = IdleDeadline.timeRemaining() < 1;

  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = IdleDeadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

let deletions = [];
function commitDeletions(fiber) {
  if (fiber.dom) {
    fiber.parent.dom.removeChild(fiber.dom);
  } else {
    commitDeletions(fiber.child);
  /*   let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent.dom.removeChild(fiber.dom);
    } */
  }
}

function commitRoot() {
  deletions.forEach(commitDeletions);
  deletions = [];
  commitWork(wipRoot.child);
  currentRootUnitOfWork = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }
  if (fiber.effectTag === 'update') {
    updateProps(fiber.dom, fiber.props, fiber.alternate.props);
  } else if (fiber.effectTag === 'placement') {
    if (fiber.dom) {
      fiberParent.dom.appendChild(fiber.dom);
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

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps = {}) {
  Object.keys(prevProps).forEach(key => {
    if (key === 'children') return;
    if (key in nextProps) return;
    dom.removeAttribute(key);
  });

  Object.entries(nextProps).forEach(([key, value]) => {
    if (key === 'children') return;
    if (value === prevProps[key]) return;
    if (key.startsWith('on')) {
      const eventType = key.slice(2).toLowerCase();
      dom.removeEventListener(eventType, prevProps[key]);
      dom.addEventListener(eventType, value);
    } else {
      dom[key] = value;
    }
  });
}

function reconcileChildren(fiber, children) {
  let preChildFiber = null;
  let oldFiber = fiber.alternate?.child;

  children.forEach((child, index) => {
    const isSameType = oldFiber?.type === child.type;
    let newChildFiber;
    if (isSameType) {
      newChildFiber = {
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
      newChildFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        child: null,
        sibling: null,
        parent: fiber,
        effectTag: 'placement'
      };
      if (oldFiber) {
        console.log('fiber', fiber);
        deletions.push(fiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newChildFiber;
    } else {
      preChildFiber.sibling = newChildFiber;
    }

    preChildFiber = newChildFiber;
  });
}

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

const React = {
  render,
  update,
  createElement
};

export default React;
