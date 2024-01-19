import React from './core/React.js';
let count = 1;
let props = { id: 'dt' };
let counterA = 111;
function Counter({ num }) {
  console.log('000');
  const update = React.update();
  function changeCount() {
    count++;
    update();
  }
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
  console.log('111');
  const update = React.update();
  function changeCount1() {
    count++;
    props = {};
    update();
  }
  return (
    <div {...props}>
      组件 111 --- {num} + {count}
      <button id='btn' onClick={changeCount1}>
        changeCount1
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
      组件 222 --- count : {num} + {count}
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

  return (
    <div>
      {counterA}
      <button id='counterA' onClick={changeCounterA}>
        changeCounterA
      </button>
      <Counter num={20} />
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
