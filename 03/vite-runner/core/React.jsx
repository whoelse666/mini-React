/* 
vdom: {
  type,
  props:{
  ...more,
  children:[]
  }
}
*/


/* 问题: 第三个参数children 传递方式  */
function createElement(type, props,  ...children) {
  // console.log("arguments", arguments.length, Array.from(arguments).slice(2))
// let   newChildren =  arguments.length>2 && Array.from(arguments).slice(2)
  // console.log("children===", typeof children, Array.isArray(children), children instanceof Array, Object.prototype.toString.call(children) /* === "[object Array]" */)
/*   let newChildren = Object.prototype.toString.call(children) === "[object Array]" ? children : [children]
console.log("newChildren", newChildren) */
return {
  type,
  props: {
    ...props,
    children: children.map(child => {
      if (typeof child === "string") {
        return createTextNode(child)
      } else {
        return child
      }
    })
  }
}
}

function createTextNode(nodeValue) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue
      // children: []
    }
  }
}

/* 
IdleDeadline 接口是在调用 Window.requestIdleCallback() 时创建的闲置回调的输入参数的数据类型。它提供了 timeRemaining() 方法，用来判断用户代理预计还剩余多少闲置时间；以及
 didTimeout (en-US) 属性，用来判断当前的回调函数是否因超时而被执行。
*/
requestIdleCallback(workLoop)

let nextWorkOfUnit = null
// 保存最终处理结束后的完整 dom,一次性挂载dom
let root = null
function workLoop(deadline) {
  let shouldYield = false
  const remainingTime = deadline.timeRemaining()
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit)
    shouldYield = remainingTime < 1
  }

  if (!nextWorkOfUnit) {
    commitRoot(root)
  }

  // 所有dom 处理结束后 , 停止 requestIdleCallback
  nextWorkOfUnit && requestIdleCallback(workLoop)
  //  requestIdleCallback(workLoop)
}

//  vDom 转换成 真实的Dom node 节点
function createDom(type) {
  return type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(type)
}

// 设置 dom props 属性
function setDomProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function commitRoot(root) {
  commitWork(root.child)
  root = null
}
function commitWork(fiber) {
  if (!fiber) {
    return
  }
  fiber.dom && fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function performUnitOfWork(fiber) {
  if (!fiber.dom) {
    //   todo 1. 创建 dom
    const dom = createDom(fiber.type)
    //  todo 2.处理 props
    setDomProps(dom, fiber.props)
    fiber.dom = dom
    /*  每次 处理 append(dom) */
    // fiber.parent.dom.append(dom)
  }

  // todo 3. 转换成链表
  const children = fiber.props.children
  let prevChild = null
  children &&
    children.forEach((child, index) => {
      if (index === 0) {
        // #root 下 第一个dom 是有 dom =( id='app'的 div) 的 dom特殊处理
        // 父子关系互相连接 parent ,child
        fiber.child = child
        child.parent = fiber
      } else {
        // 同一个 fiber 下的 child 满足都在同一级,所以用 sibling链接
        prevChild.sibling = child
        child.parent = prevChild.parent
      }
      prevChild = child
    })
  // todo 4. 处理当前任务后，返回下一个任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling
}

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  // 初始化 root = 第一级别子节点 dom( id= 'app')
  root = nextWorkOfUnit
}
 

export default {
  render,
  createElement
}
