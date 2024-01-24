import React from './core/React.js';
let count = 10;
let count1 = 10;
let props = { id: 'bg' };
function Counter({ num }) {
  // update
  function handleClick() {
    console.log('click');
    count++;
    count1 = count1 + count;
    props = {};
    React.update();
  }
  return (
    <div {...props}>
      <p> count: {count}</p>
      <p> count1: {count1}</p>
      <p>num:{num}</p>
      <button onClick={handleClick}>click</button>
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
