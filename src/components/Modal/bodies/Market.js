import React, { Component, Fragment } from 'react';

import { Header, Table, Star } from '../../share';


const columns = [
  {
    renderHead: () => <Star key={0} />,
    width: '25px'
  },
  {
    Header: 'Pair'
  },
  {
    Header: 'Price'
  },
  {
    Header: 'Volume'
  },
  {
    Header: 'Price ICO'
  }
];

class Market extends Component {
  render() {
    return (
      <Fragment>
        <Header>Markets</Header>
        <Table data={[]} columns={columns} />
      </Fragment>
    );
  }
}

export default Market;