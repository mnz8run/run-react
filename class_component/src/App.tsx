import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import React from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      <MyComponent />
    </>
  );
}

export default App;

class MyComponent extends React.Component<unknown, { count: number }> {
  // 使用类属性语法定义 state
  state = {
    count: 0,
  };

  // 使用类属性语法和箭头函数定义事件处理器
  // 这样可以确保 handleClick 方法中的 this 指向组件实例
  class_attribute_syntax_and_arrow_function = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  handleClick() {
    console.log('this', this);
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  }

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <button onClick={this.handleClick}>this is undefined</button>
          <button onClick={this.class_attribute_syntax_and_arrow_function}>class_attribute_syntax_and_arrow_function</button>
          <button
            onClick={() => {
              this.handleClick();
            }}
          >
            arrow function
          </button>
          {/* 还可以在构造函数中绑定 */}
          <button onClick={this.handleClick.bind(this)}>bind method this</button>
        </div>
      </div>
    );
  }
}
