import React from "./React.jsx";
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
