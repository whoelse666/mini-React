import React from './core/React.js';
// import ReactDom  from './core/ReactDom.js';
const dom1 = (
  <div>
    111
    <div>
      222
      <div>mini-react </div>
    </div>
  </div>
);

// const App = React.createElement('div', { id: 'app' }, 'hi- ', 'mini-react');
const App = React.createElement('div', { id: 'app' }, dom1);
export default App;
