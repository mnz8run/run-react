import React from 'react';

/**
 * ArrowFunctionClassProperties 推荐
 *
 * 不需要手动绑定 现代浏览器中，和 ConstructorBind 差异很小
 */
export class ArrowFunctionClassProperties extends React.Component<
  unknown,
  ClassComponentState
> {
  state: ClassComponentState = {
    count: 0,
  };
  handleClick = () => {
    console.log(this.state);
  };
  render() {
    return (
      <button onClick={this.handleClick}>ArrowFunctionClassProperties</button>
    );
  }
}

/**
 * ConstructorBind 推荐
 *
 * 只绑定一次 性能好
 *
 * 方法定义在原型上
 */
export class ConstructorBind extends React.Component<
  unknown,
  ClassComponentState
> {
  state: ClassComponentState = {
    count: 0,
  };
  constructor(props: unknown) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log(this.state);
  }
  render() {
    return <button onClick={this.handleClick}>ConstructorBind</button>;
  }
}

/**
 * ArrowFunctionInJSX 不推荐
 *
 * 每次渲染都会创建新的函数 性能较差
 */
export class ArrowFunctionInJSX extends React.Component<
  unknown,
  ClassComponentState
> {
  state: ClassComponentState = {
    count: 0,
  };
  handleClick() {
    console.log(this.state);
  }
  render() {
    return (
      // 每次 render 都会创建新的函数
      <button onClick={() => this.handleClick()}>ArrowFunctionInJSX</button>
    );
  }
}

/**
 * BindInJSX 不推荐
 *
 * 每次组件重新渲染时都会创建一个新的函数 性能较差
 *
 * bind 总是返回一个新的函数
 */
export class BindInJSX extends React.Component<unknown, ClassComponentState> {
  state: ClassComponentState = {
    count: 0,
  };
  handleClick() {
    console.log(this.state);
  }
  render() {
    // 每次 render 都会创建新的函数
    return <button onClick={this.handleClick.bind(this)}>BindInJSX</button>;
  }
}

// this 指向问题
//
// 每次渲染都创建新函数，可能导致子组件不必要的重新渲染，影响性能
//
// 避免在渲染方法中创建新的函数引用
// 保持函数引用的稳定性，有助于 React 的性能优化

interface ClassComponentState {
  count: number;
}
