import React from './core/React.js';

function Counter({ num }) {
  return <div>count: {num}</div>;
}


const App = (
  <div id='app-666'>
    hi-mini-react
    <Counter  num={15} ></Counter>
  </div>
);

export default App;
