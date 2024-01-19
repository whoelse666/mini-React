import React from './core/React.js';
let count = 1;
function Counter({ num }) {
  return (
    <div id='counter'>
      <hr />
      组件 000 --- count : {num} + {count} <Counter2 />
      <button id='btn' onClick={changeCount}>
        click
      </button> 
      
      <hr />
    </div>
  );
}
function Counter1({ num }) {
  return (
    <div id='counter'>
      count111 : {num} + {count}
      <button id='btn' onClick={changeCount1}>
        click
      </button>
    </div>
  );
}
function Counter2({ num }) {
  console.log('222');
  const update = React.update();
  function changeCount2() {
    count++;
    update();
  }
  return (
    <div>
      组件 222 --- count :{count}
      <button onClick={changeCount2}>点这里有bug</button>
    </div>
  );
}

function CounterA() {
  const update = React.update();
  console.log('counterA');
  function changeCounterA() {
    counterA++;
    update();
  }

function CounterA() {
  return (
    <div>
      {/* <Counter num={30} />
      <Counter1 num={10} /> */}
      <Counter1 num={10} />
    </div>
  );
}

const App = () => {
  return (
    <div id='app'>
      <CounterA />
    </div>
  );
};

export default App;
