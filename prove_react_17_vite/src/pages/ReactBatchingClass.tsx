import React from 'react';

interface ReactBatchingClassState {
  count: number;
}

export class ReactBatchingClass extends React.Component<
  unknown,
  ReactBatchingClassState
> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count); // 0
    this.setState({ count: this.state.count + 1 });
    console.log(this.state.count); // 0

    setTimeout(() => {
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count); // 2
      this.setState({ count: this.state.count + 1 });
      console.log(this.state.count); // 3
    }, 0);
  }

  render() {
    return <>ReactBatchingClass</>;
  }
}
