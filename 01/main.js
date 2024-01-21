/* 
vdom: {
  type,
  props:{
  ...more,
  children:[]
  }
}
*/

function createElement(type, props, children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        if (typeof child === 'string') {
          return createTextNode(child);
        } else {
          return child;
        }
      })
    }
  };
}

function createTextNode(nodeValue) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue
      // children: []
    }
  };
}

function render(el, container) {
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);
  Object.keys(el.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = el.props[key];
    }
  });
  const children = el.props.children;
  children && children.forEach(child => render(child, dom));
  container.appendChild(dom);
}

const App = createElement('div', { id: 'app' }, ['hello ', 'world']);
const App1 = createTextNode('world');
const root = document.querySelector('#root');
render(App, root);
