import React from "./React.js";

const ReactDom = {
  createRoot(container) {
    return {
      render(el) {
        React.render(el, container);
      }
    };
  }
};

export default ReactDom;
