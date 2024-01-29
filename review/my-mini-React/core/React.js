// const rootDom = document.getElementById('root');
/* const domNode = document.createElement('div');
const textNode = document.createTextNode('Hello World!');
domNode.id = 'app';
domNode.appendChild(textNode);
rootDom.appendChild(domNode) */

function createTextNode(nodeValue) {
  console.log('1');

  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue,
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
        return typeof child === 'string' ? createTextNode(child) : child;
      })
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

  children.forEach(child => {
    render(child, dom);
  });
  container.append(dom);
}

const React = {
  render,
  createElement
};

export default React;
