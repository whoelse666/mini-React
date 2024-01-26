import React from './React.js';
const ReactDom = {
  createRoot(container) {
    return {
      render(rootDom) {
        React.render(rootDom, container);
      }
    };
  }
};

export default ReactDom;
