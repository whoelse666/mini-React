/* 
const dom = document.createElement('div');
dom.id = "app";
document.querySelector("#root").appendChild(dom);

const text = document.createTextNode('Hello, world!');
dom.appendChild(text); */

/*  const textEl = {
  type: "TEXT_ELEMENT",
  props: {
    id: "text",
    nodeValue: "Hello, world 666 !",
    children: []
  }
}; 
const el = {
  type: "div",
  props: {
    id: "app",
    children: [
    ]
  }
};
const dom = document.createElement(el.type);
dom.id = el.props.id;
document.querySelector("#root").appendChild(dom);

const text = document.createTextNode("");
text.nodeValue = textEl.props.nodeValue;
dom.appendChild(text); */
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
function render(el, container) {
  const dom = el.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(el.type);
    Object.keys(el.props).forEach(key => {
      if (key !== "children") {
        dom[key] = el.props[key];
      }
    });
    const children = el.props.children;
    children.forEach(child => {
      render(child, dom);
    });
  container.append(dom);
}


const textEl = createTextNode("Hello, world 999 !");
const App = createElement("div", { id: "app" }, "hi-", "mini-react");

console.log("App", App);
render(App, document.querySelector("#root"));

