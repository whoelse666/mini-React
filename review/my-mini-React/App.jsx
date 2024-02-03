import React from './core/React.js';
// import ReactDom  from './core/ReactDom.js';
const dom1 = (
  <div>
    111
    <div>
      222
    </div>
    {/* <button onClick={ handle1 }>click</button> */}
  </div>
);
function Count() { 
  return (
    <div id='1'>
      111
      <div id='2'>222</div>
    </div>
  );
}
// const App = React.createElement('div', { id: 'app' }, 'hi- ', 'mini-react');
const App = React.createElement('div', { id: 'app' }, dom1);
// const App = React.createElement('div', { id: 'app' }, <Count />);
export default App;
