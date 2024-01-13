
const dom = document.createElement('div');
dom.id = "app";
document.querySelector("#root").appendChild(dom);

const text = document.createTextNode('Hello, world!');
dom.appendChild(text);