function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isFn = ["string", "number"].includes(typeof child)
        return isFn ? createTextNode(child) : child
      })
    }
  }
}

let wipRoot = null,
  currentRoot = null,
  nextFiberOfUnit = null
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextFiberOfUnit = wipRoot
}

function workLoop(deadline) {
  console.log("console", 1)
  let shouldYield = false
  // nextFiberOfUnit
  while (!shouldYield && nextFiberOfUnit) {
    nextFiberOfUnit = performWorkOfUnit(nextFiberOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }
  if (!nextFiberOfUnit && wipRoot) {
    // nextFiberOfUnit===null,表示链表结束，结束时统一提交
    commitRoot(wipRoot)
  }
  !wipRoot && requestIdleCallback(workLoop)
  /* // 课程代码
  requestIdleCallback(workLoop) */
}

function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

function updateProps(dom, nextProps, prevProps) {
  // 1. 老的有 新的没有=== 删除节点
  Object.keys(prevProps).forEach(key => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom && dom.removeAttribute(key)
      }
    }
  })
  //2.new 有 old 没有 添加
  //3.new 有 old 有 ===修改
  Object.keys(nextProps).forEach(key => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          dom.addEventListener(key.slice(2).toLowerCase(), nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function update(dom, props) {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  }
  nextFiberOfUnit = wipRoot
  requestIdleCallback(workLoop)
}

function reconcileChildren(fiber, children) {
  // const children = fiber.props.children; //拿到第一个 children,作为链表第一个点
  let oldFiber = fiber.alternate?.child
  let prevChild = null,
    newFiber = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    isSameType
      ? (newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: oldFiber.dom,
          effectTag: "update",
          alternate: oldFiber
        })
      : (newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: "placement"
        })
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if (index === 0) {
      fiber.child = newFiber // 链表的 head
    } else {
      prevChild.sibling = newFiber // 保存当前节点的前一个节点用于建立指针到下一个
    }
    prevChild = newFiber // 更新 prevChild
  })
}

function commitRoot(wipRoot) {
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }

  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    fiber.dom && fiberParent.dom.append(fiber.dom)
  }

  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

// 处理函数组件
function updateFunctionComponent(fiber) {
  //  转换结构- 链表
  const children = [fiber.type(fiber.props)]
  reconcileChildren(fiber, children)
}

// 处理普通元素
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    // 1. 创建 Dom
    const dom = (fiber.dom = createDom(fiber.type))
    // 2. 处理 props
    updateProps(dom, fiber.props, {})
  }
  const children = fiber.props.children
  reconcileChildren(fiber, children)
}

function performWorkOfUnit(fiber) {
  const isFunCom = typeof fiber.type === "function"
  if (isFunCom) {
    updateFunctionComponent(fiber)
  } else {
    updateHostComponent(fiber)
  }

  //4.返回下一个执行 任务
  if (fiber.child) {
    return fiber.child
  }
  /*   if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling //父结点的兄弟节点
 */
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}

// 函数将在浏览器空闲时期被调用
requestIdleCallback(workLoop)

const React = {
  update,
  render,
  createElement
}
export default React
