import React from './core/React.js';
let count = 10;
let count1 = 10;
let props = { id: 'bg' };
let showBar = false;
function Counter({ num }) {
  function Foo() {
    return <div>foo</div>;
  }
  const bar = <p>bar</p>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  function handleClick() {
    console.log('click');
    count++;
    count1 = count + 3;
    props = {};
    React.update();
  }
  return (
    <div {...props}>
      {/* <p> count: {count}</p>
      <p> count1: {count1}</p> */}
      {/* <p>num:{num}</p> */}
      {/* <button onClick={handleClick}>click</button> */}
      <hr />
      <button onClick={handleShowBar}>showBar</button>
      <div>{showBar ? bar : <Foo></Foo>}</div>
    </div>
  );
}

const App = (
  <div id='app-666'>
    hi-mini-react
    {/* <Counter></Counter> */}
    <Counter num={15}></Counter>
  </div>
);

export default App;
