import React from './core/React.js';
let count = 1;
let props = { id: 'dt' };
let counterA = 111;
function Counter() {
  console.log('000');
  //  const update = React.update();
  const [count1, setCount1] = React.useState(10);
  const [bar, setBar] = React.useState('bar');

  return (
    <div id='counter'>
      <hr />
      <div>{bar}</div>
      组件 000 : count1=== :<div> {count1}</div> {/* <Counter2 /> */}
      <button id='btn' onClick={() => setCount1(c => c + 1)}>
        click setCount1
      </button>
      <button
        id='btn'
        onClick={() => {
          console.log('新旧值相同,不执行');
          return setBar(b => 'bar');
        }}
      >
        click setBar
      </button>
      <hr />
    </div>
  );
}

function Foo() {
  console.log('re foo');
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState('bar');
  function handleClick() {
    setCount(c => c + 1);
    setBar(s => s + 'bar');
  }

  return (
    <div>
      <h1>foo</h1>
      {count}
      <div>{bar}</div>
      <button onClick={handleClick}>click</button>
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
      组件 222 --- count {count} <button onClick={changeCount2}>点这里有bug</button>
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
      <Counter num={20} /> <Counter1 num={10} />
    </div>
  );
}
const App = () => {
  return (
    <div id='app'>
      {/* <CounterA /> */} <Counter />
    </div>
  );
};
export default App;
