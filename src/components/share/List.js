import React, { Component } from "react";
import PropTypes from 'prop-types';
import Scrollbar from "react-custom-scrollbars";
import { List } from 'react-virtualized';

class VirtualizedListWithCustomScroll extends Component {
  componentDidMount() {
    this.scrollTop = this.scroll.scrollTop;
  }

  handleScroll = ({ target }) => {
    this.props.onScroll(target);
    const { scrollTop } = target;
    const { Grid: grid } = this.List;
    grid.handleScrollEvent({ scrollTop });
  }

  scrollTop = () => {}

  render() {
    const { rowCount, rowHeight, height, width, renderRow, scrollBarProps } = this.props;
    const fullScrollBarProps = {
      ref: (scroll) => {this.scroll = scroll;},
      autoHeight: true,
      autoHeightMin: 0,
      autoHeightMax: height,
      onScroll: this.handleScroll,
      ...scrollBarProps
    };
    return (
      <Scrollbar {...fullScrollBarProps}>
        <List
          style={{
            overflowX: false,
            overflowY: false
          }}
          ref={instance => {this.List = instance;}}
          height={Math.min(rowCount * rowHeight, height)}
          width={width}
          rowCount={rowCount}
          rowHeight={rowHeight}
          rowRenderer={renderRow}
        />
      </Scrollbar>
    );
  }
}

VirtualizedListWithCustomScroll.propTypes = {
  rowCount: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  renderRow: PropTypes.func.isRequired,
  scrollBarProps: PropTypes.object,
  onScroll: PropTypes.func
};

VirtualizedListWithCustomScroll.defaultProps = {
  scrollBarProps: {},
  onScroll: () => {}
};

export default VirtualizedListWithCustomScroll;