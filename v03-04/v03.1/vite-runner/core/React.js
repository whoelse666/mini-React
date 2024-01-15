function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
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
        return typeof child === "string" ? createTextNode(child) : child;
      })
    }
  };
}

let shouldYield = false,
  nextWorkOfUnit = {};
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  };
}

function workLoop(deadline) {
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    const time = deadline.timeRemaining();
    shouldYield = time < 1;
  }
  // requestIdleCallback(workLoop);

  /* deadline.timeRemaining()返回一个 DOMHighResTimeStamp，其为浮点数，用来表示当前闲置周期的预估剩余毫秒数。如果闲置期已经结束，则其值为 0。你的回调函数可以重复调用该函数，以判断目前是否有足够的时间来执行更多的任务。 */
  /* deadline.didTimeout; 布尔值，如果回调是因为超过了设置的超时时间而被执行的，则其值为 true。*/
}

/* 
1. 创建 dom
2.处理 props
3. 转换成链表
4. 处理当前任务后，返回下一个任务
*/
function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    // 1. 创建 dom
    const dom = (fiber.dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type));
    fiber.parent.dom.append(dom);
    // 2.处理 props
    Object.keys(fiber.props).forEach(key => {
      if (key !== "children") {
        dom[key] = fiber.props[key];
      }
    });
  }
  // 3. 转换成链表
  const children = fiber.props.children;
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
    console.log("child", child);
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 此时prevChild === 上一个节点
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });

  // 4. 处理当前任务后，返回下一个任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);


/* setTimeout(function () {
  
  const p = document.querySelector("#txt");
  console.log("p", p);
  p.textContent = "888"
},5000) */

const React = {
  render,
  createElement
};
export default React;
