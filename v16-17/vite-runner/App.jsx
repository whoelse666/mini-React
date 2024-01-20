import React from './core/React.js';

function Counter() {
  const [count1, setCount1] = React.useState(10);
  const [bar, setBar] = React.useState('bar');

  React.useEffect(() => {
    console.log('useEffect init111');
  }, []);
  React.useEffect(() => {
    // 相当于 componentDidMount、componentDidUpdate
    console.log('useEffect init222', count1, bar);
    // }, [count1,bar]);
  }, [count1]);

  return (
    <div id='counter'>
      <hr />
      <div id='barProps'>{bar}</div>
      组件 000 : count1=== :<div> {count1}</div>
      <button id='btn' onClick={() => setCount1(c => c + 1)}>
        click setCount1
      </button>
      <button
        id='btn'
        onClick={() => {
          return setBar(b => b + 'bar');
        }}
      >
        click setBar
      </button>
      <hr />
    </div>
  );
}

const App = () => {
  return (
    <div id='app'>
      <Counter />
    </div>
  );
};
export default App;
