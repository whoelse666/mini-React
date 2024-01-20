/**@jsx MyReact.createElement  */ //todo 自定义 jsx解析方法

import React from "./core/React.js";
import MyReact from "./core/React.js";

// const App = React.createElement("div", { id: "app" }, "hi-", "mini-react");
const App = <div id="app"> hi mini-react from jsx</div>;
function App2() { 
  return <div id="app"> hi mini-react from jsx</div>;
}
// console.log("App2", App2);
export default App;
