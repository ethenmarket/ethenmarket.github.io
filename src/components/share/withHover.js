import React, { Component } from 'react';

const withHover = (Wrapped) => class WithHover extends Component {
  static displayName = `withHover(${Wrapped.displayName})`
  state = { hover: false }
  hoverOn = () => {
    this.setState({ hover: true });
  }
  hoverOff = () => {
    this.setState({ hover: false });
  }
  render() {
    return (
      <div
        style={{ height: '100%' }}
        onMouseEnter={this.hoverOn}
        onMouseLeave={this.hoverOff}
      >
        <Wrapped hover={this.state.hover} {...this.props} />
      </div>
    );
  }
};

export default withHover;