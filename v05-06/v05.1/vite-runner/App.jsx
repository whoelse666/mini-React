import React from "./core/React.js";
function Counter({ num }) {
  return (
    <div id="counter" style="color:yellow;width:300px;height:100px;background:blue">
      count : {num}
    </div>
  );
}
function CounterA() {
  return <Counter />;
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
    <p style="color:pink">666</p>
    hi mini-react from fiber
    <Counter num={10} />
  </div>
);

export default App;
