const rootDom = document.getElementById('root');

const domNode = document.createElement('div');

const textNode = document.createTextNode('Hello World!');

function createTextNode(nodeVal) {
  return {
    type: 'TEXT_ELEMENT',
    nodeVal
  };
}

function createElement(type, props, children) {
  return {
    type,
    props: {
      ...props,
      children
    }
  };
}

function render(el, container) {
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode(el.nodeVal) : document.createElement(el.type);
  el.props &&
    Object.keys(el.props).forEach(key => {
      if (key !== 'children') {
        dom[key] = el.props[key];
      }
    });

  const children = el.props.children;
  console.log(typeof children === 'string');
  console.log('children', children);
  typeof children === 'string'
    ? dom.append(document.createTextNode(children))
    : children.forEach(child => {
        render(child, dom);
      });

  container.append(dom);
}

const React = {
  render,
  createElement
};

// domNode.id = 'app';
// domNode.appendChild(textNode);
// rootDom.appendChild(domNode);

const App = <div>hi-mini-react</div>;

render(App, rootDom);
