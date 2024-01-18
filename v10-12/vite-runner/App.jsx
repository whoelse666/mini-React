import React from './core/React.js';
let count = 1;
function Counter({ num }) {
  return (
    <div id='counter' style='color:yellow;width:300px;height:100px;background:blue'>
      count : {num} + {count}
      <button id='btn' onClick={changeCount}>
        click
      </button>
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

function changeCount() {
  console.log('changeCount', count);
  count++;
  React.update();
}
function changeCount1() {
  console.log('changeCount1', count);
  count++;
  React.update();
}

let isDivDom = false;
function divDom() {
  return <div id='divDom'>divDom</div>;
}
function Dom() {
  let pDom = <p id='pDom'>pDom</p>;
  return (
    <div>
      <button id='changeDom' onClick={changeDom}>
        changeDom
      </button>
      <div id='divDom'>{isDivDom ? <divDom></divDom> : pDom}</div>
    </div>
  );
}
function changeDom() {
  isDivDom = !isDivDom;
  React.update();
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
      {/* <p style='color:pink'>666</p>
      hi mini-react from fiber */}
      <Counter1 num={10} />
      <Dom />
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
