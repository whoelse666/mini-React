import React from './core/React.js';
let props = { id: 'bg' };
let showBar = false;
function Counter1({ num }) {
  function Foo() {
    return (
      <div>
        foo
        <div>child1</div>
        <div>child2</div>
      </div>
    );
  }
  const bar = <div>bar</div>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }
  return (
    <div {...props}>
      <hr />
      <button onClick={handleShowBar}>showBar</button>
      {/* <div>{showBar ? bar : <Foo></Foo>}</div> */}
      <div>{showBar && <Foo></Foo>}</div>
    </div>
  );
}

function Counter() {
  const foo = (
    <div>
      foo
      <div>child1</div>
      <div>child2</div>
    </div>
  );

  const bar = <div>bar</div>;

  function handleShowBar() {
    showBar = !showBar;
    React.update();
  }

  return (
    <div {...props}>
      Counter
      <button onClick={handleShowBar}>showBar</button>
      <div>{showBar ? bar : foo}</div>
    </div>
  );
}
const App = (
  <div id='app-666'>
    hi-mini-react
    <Counter1 num={15}></Counter1>
  </div>
);

export default App;
