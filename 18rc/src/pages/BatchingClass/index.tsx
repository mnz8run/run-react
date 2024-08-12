/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React from 'react';

class BatchingClass extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      val: 0,
    };
  }

  componentDidMount() {
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val);
    this.setState({ val: this.state.val + 1 });
    console.log(this.state.val);

    setTimeout(() => {
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val);
      this.setState({ val: this.state.val + 1 });
      console.log(this.state.val);
    }, 0);
  }

  render() {
    return null;
  }
}

export default BatchingClass;
