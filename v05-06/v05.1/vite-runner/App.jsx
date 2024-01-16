import React from "./core/React.js";
function Counter({ num }) {
  return (
    <div id="counter" style="color:yellow;width:300px;height:100px;background:blue">
      count : {num}
    </div>
  );
}

function CounterA() {
  return (
    <div>
      <Counter num={30} />
      <Counter num={20} />
    </div>
  );
}

  const  App = ()=> {
  return (
    <div id='app'>
      <p style='color:pink'>666</p>
      hi mini-react from fiber
      <CounterA />
    </div>
  );
}  

/* const App = (
  <div id='app'>
    <p style='color:pink'>666</p>
    hi mini-react from fiber
    <CounterA />
  </div>
); */

export default App;
