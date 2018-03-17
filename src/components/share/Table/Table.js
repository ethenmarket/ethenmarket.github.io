import React, { Component } from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";
import isFloat from 'validator/lib/isFloat';
import BigNumber from 'bignumber.js';
import Loading from '../Loading';

import {
  TableBody as Body,
  TableHeader as Header,
  HeadCell,
  Cell,
  Row,
  TableText
} from "./styled";

const renderCustomThumb = (style, props) => (
  <div
    {...style}
    style={{
      backgroundColor: "#96a7b8",
      borderRadius: "3px",
      cursor: "pointer"
    }}
    {...props}
  />
);

const getCellContent = (value, precision) => {
  if (!value) return '';
  if (precision === true || !isFloat(value)) return value;

  return BigNumber(value).toFixed(precision || 2);
};

const defaultCompare = (a, b, order) => {
  if (a == undefined || b == undefined) return 1; // eslint-disable-line eqeqeq

  const isNumbers = isFloat(a.toString()) && isFloat(b.toString());
  if (!isNumbers) {
    if (order) {
      if (a === b) return 0;
      return a > b ? 1 : -1;
    }
    if (a === b) return 0;
    return a > b ? -1 : 1;
  }
  return order ? b - a : a - b;
};

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = this.sortData(props.data, { index: 0, order: true });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data === this.props.data) return;
    this.setState(this.sortData(nextProps.data, this.state.sortedColumn));
  }

  handleSort = (data, index) => this.setState(state => this.sortData(data, { index, order: !state.sortedColumn.order }))

  sortData = (data, sortedColumn) => {
    const { groupBy, columns } = this.props;
    const clearedData = data.filter(d => !d.groupBy_inner);
    const comparator = ((a, b) => {
      const { accessor } = columns[sortedColumn.index];
      const compare = columns[sortedColumn.index].comparator || defaultCompare;
      return compare(a[accessor], b[accessor], sortedColumn.order);
    });
    const grouped = [];
    if (groupBy) {
      let groups = new Set();
      clearedData.forEach(d => groups.add(d[groupBy]));
      groups = [...groups];
      groups.forEach(g => {
        grouped.push({
          groupBy_inner: g
        });
        const groupData = clearedData.filter(datum => datum[groupBy] === g);
        groupData.sort(comparator);
        grouped.push(...groupData);
      });
    }

    return ({
      sortedData: groupBy ? grouped : [...clearedData].sort(comparator),
      sortedColumn
    });
  }

  render() {
    const { columns, height, odd } = this.props;
    const { sortedData, sortedColumn } =  this.state;
    return (
      <div style={{ height }}>
        <Header
          columns={columns.length}
          innerRef={header => {
            this.header = header;
          }}
          widths={columns.map(c => c.width)}
        >
          {
            columns.map((col, index) => col.renderHead ? col.renderHead(col) : (
              <HeadCell
                key={col.Header || index}
                onClick={() => this.handleSort(sortedData, index)}
                sorted={sortedColumn.index === index}
                order={sortedColumn.order}
                text={col.Header}
              >
                <TableText>{col.Header}</TableText>
              </HeadCell>
            ))
          }
        </Header>
        <Scrollbars
          style={{ width: "100%", height: "calc(100% - 30px)" }}
          renderThumbVertical={renderCustomThumb}
        >
          <Body
            innerRef={body => {
              this.body = body;
            }}
          >
            {sortedData.map((datum, index) => (
              <Row
                key={index} //
                columns={columns.length}
                odd={odd}
                widths={columns.map(c => c.width)}
              >
                {
                  datum.groupBy_inner
                    ? columns.map((_, i) => (
                      i === 0
                        ? (
                          <Cell key={datum.groupBy_inner} title={datum.groupBy_inner}>{datum.groupBy_inner}</Cell>
                        )
                        : <div />
                    ))
                    : columns.map((col, index) => (
                      <Cell
                        key={index}
                        color={col.color && col.color(datum)}
                        title={datum[col.accessor]}
                      >
                        <TableText>
                          {
                            col.renderCell
                              ? col.renderCell(datum)
                              : getCellContent(datum[col.accessor], col.precision)
                          }
                        </TableText>
                      </Cell>
                    ))
                }
              </Row>
            ))}
          </Body>
        </Scrollbars>
      </div>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string,
      accessor: PropTypes.string
    })
  ),
  data: PropTypes.array,
  height: PropTypes.string,
  odd: PropTypes.bool,
  groupBy: PropTypes.string
};

Table.defaultProps = {
  columns: [],
  data: [],
  height: "auto",
  odd: false,
  groupBy: null
};

export default Loading(Table);
