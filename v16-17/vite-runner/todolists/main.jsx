import React from "./core/React.js";
import ReactDom from "./core/ReactDom.js";
import App from "./App.jsx";

// import ReactDom from './core/ReactDom.js';
// import App from './App.jsx';
//  import React from '/core/React.js'; //解析 因为这里用了<App />，解析他需要用到React.createElement
ReactDom.createRoot(document.querySelector("#root")).render(<App />);
// ReactDom.createRoot(document.querySelector("#root")).render(App);
