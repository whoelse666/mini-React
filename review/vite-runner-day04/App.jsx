import React from './core/React.js';
let count = 10;
let props = { id: 'bg' };
function Counter({ num }) {
  // update
  function handleClick() {
    console.log('click');
    count++;
    props = {};
    React.update();
  }
  return (
    <div {...props}>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}
 

const App = (
  <div id='app-666'>
    hi-mini-react
    <Counter num={15}></Counter>
  </div>
);

export default App;
