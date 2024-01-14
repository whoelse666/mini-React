import React from "./core/React.js";

const App = React.createElement("div", { id: "app" }, "hi-", "mini-react");
const App1 = <div id="app"> hi mini-react from jsx</div>;

console.log('App', App)
console.log('App1', App1)
export default App;
