import React from "./core/React.jsx"

function Counter({ num }) {
  return (
    <div id="counter" style="color:yellow;width:300px;height:100px;background:blue">
      count : {num}
    </div>
  )
}
function CounterA() {
  return <Counter />
}
/* const  App = ()=> {
  return (
    <div id="app">
      <p style="color:pink">666</p>
      hi mini-react from fiber
      <Counter />
    </div>
  );
} */
const App = (
  <div id="app">
    <p style="color:pink">111</p>
    222
    <p style="color:pink">333</p>
    333
  </div>
)
function App1() {
  return (
    <div id="app">
      111
      <span>222</span>
      <span>333</span>
    </div>
  )
}

console.log("App1", App1)
//  const App = React.createElement("div", { id: "app" }, ["hello ", "world"]);
export default App
