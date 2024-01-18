import React from './core/React.js';
let count = 1;
let props = { id: 'dt' };

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
      组件 000 --- count : {num} + {count}
      <Counter2></Counter2>
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
      组件 000 --- count : {num} + {count}
      <button onClick={changeCount2}>changeCount2</button>
    </div>
  );
}

let isDivDom = false;
function Foo() {
  return <div id='Foo'>divDom</div>;
}
function Dom() {
  let pDom = <p id='pDom'>pDom</p>;
  let divDom = <p id='divDom'>divDom</p>;
  const update = React.update();

  function changeDom() {
    isDivDom = !isDivDom;
    update();
  }

  return (
    <div id='aaa'>
      <hr />
      <h2>day05</h2>
      {isDivDom && pDom}
      {/* <div> {isDivDom && pDom}</div> */}
      <button id='changeDom' onClick={changeDom}>
        changeDom
      </button>
      {/* <div id='last'>{isDivDom ? <Foo></Foo> : pDom}</div> */}
    </div>
  );
}
let counterA = 111;
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
      {/* <p style='color:pink'>666</p>
      hi mini-react from fiber */}
      <CounterA />
      {/* <Dom /> */}
    </div>
  );
};

/* const App = (
  <div id='app'>
    <p style='color:pink'>666</p>
    hi mini-react from fiber
    <CounterA />
  </div>
); */

export default App;
