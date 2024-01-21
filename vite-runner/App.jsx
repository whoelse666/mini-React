import React from './core/React.js';

function Counter({ num }) {
  // return <div>count: {num}</div>;
  return <div>count: 10</div>;
}

// function App() {
//   return (
//     <div>
//       hi-mini-react
//       <Counter /* num={10} */></Counter>
//       {/* <Counter num={20}></Counter> */}
//     </div>
//   );
// }
const App = (
  <div id='app-666'>
    hi-mini-react
    <Counter /* num={10} */></Counter>
    {/* <Counter num={20}></Counter> */}
  </div>
);

export default App;
