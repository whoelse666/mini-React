import React from './core/React.js';
// import ReactDom  from './core/ReactDom.js';
// const App = (
//   <div>
//     111
//     {/* <Count></Count> */}
//     <CountP></CountP>
//     {/* <button onClick={ handle1 }>click</button> */}
//   </div>
// );
let num = 0;
const App = () => {
  function handle1() {
    console.log('num', num);
    num++;
  }
  return (
    <div>
      111
      <CountP></CountP>
      <button onClick={handle1}>click</button>
    </div>
  );
};
function Count() {
  return <div id='1'>count</div>;
}
function CountP() {
  return (
    <div>
      999
      <Count></Count>
    </div>
  );
}
// const App = React.createElement('div', { id: 'app' }, 'hi- ', 'mini-react');
// const App = React.createElement('div', { id: 'app' }, dom1);
// const App = React.createElement('div', { id: 'app' }, <Count />)
export default App;
