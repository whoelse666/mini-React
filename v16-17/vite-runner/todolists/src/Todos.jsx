import React from "../core/React";

export function Todos() {
  const [todoValue, setTodoValue] = React.useState("");
  const [todos, setTodos] = React.useState([
    {
      title: "111",
      completed: false,
      id: crypto.randomUUID()
    },
    {
      title: "222",
      completed: true,
      id: crypto.randomUUID()
    },
    {
      title: "333",
      completed: false,
      id: crypto.randomUUID()
    }
  ]);

  function handleComplete(id) {
    // setTodos(todos.map(todo => {
    //   if (todo.id === id) {
    //   }
    // }))
  }
  function handleAdd() {
    console.log('handleAdd',);
    setTodos([...todos, { title: todos.length, completed: false, id: crypto.randomUUID() }]);
  }
  function handleDelete(id) {}
  return (
    <div>
      {/* <input type="text" value={todoValue} /> */}
      <button onClick={handleAdd}>add</button>
      <ul>
        {...todos.map(todo => (
          <li>
            <span>Learn React</span>
            <button onClick={() => handleComplete(todo.id)}>{todo.completed ? "❎" : "✅"}</button>
            <button onClick={() => handleDelete(todo.id)}>️del</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
