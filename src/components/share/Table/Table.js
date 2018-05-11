import React, { Component } from "react";
import PropTypes from "prop-types";
import isFloat from "validator/lib/isFloat";
import { getCellContent } from "../../../utils";
import List from "../List";

import "./table.css";

import {
  TablePreHeader as PreHeader,
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

const defaultCompare = (a, b, order) => {
  if (a == undefined || b == undefined) return 0; // eslint-disable-line eqeqeq
  if (a === b) return 0;
  const isNumbers = isFloat(a.toString()) && isFloat(b.toString());
  if (typeof a === "boolean" && typeof b === "boolean") {
    if (order) {
      return b === true ? 1 : -1;
    }
    return b === true ? -1 : 1;
  }
  if (!isNumbers) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (order) {
      return a > b ? 1 : -1;
    }
    return a > b ? -1 : 1;
  }

  return order ? b - a : a - b;
};

class Table extends Component {
  constructor(props) {
    super(props);
    const sortedData = this.sortData(
      props.data,
      { index: 0, order: true },
      { groupBy: props.groupBy, columns: props.columns }
    );
    const initialData = {
      sortedData: props.data,
      sortedColumn: { index: -1, order: false }
    };
    const data = props.initialSort ? sortedData : initialData;
    this.state = {
      ...data,
      bodyHeight: "calc(100% - 30px)",
      rootWidth: 0
    };
  }

  componentDidMount() {
    this.updateSizes();
    window.addEventListener("resize", this.updateSizes);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const sortedData = this.sortData(
        nextProps.data,
        { index: 0, order: true },
        { groupBy: nextProps.groupBy, columns: nextProps.columns }
      );
      const initialData = {
        sortedData: nextProps.data,
        sortedColumn: { index: -1, order: false }
      };
      const data = nextProps.initialSort ? sortedData : initialData;
      this.setState(data);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.preHeader !== this.props.preHeader ||
      prevProps.data !== this.props.data
    ) {
      this.updateSizes();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateSizes);
  }

  setRootWidth = () => {
    const rootWidth = (this.root && this.root.clientWidth) || 0;
    this.setState({
      rootWidth
    });
  };

  calculateBodyHeight() {
    const preHeaderHeight =
      (this.preHeader && this.preHeader.clientHeight) || 0;
    const headerHeight = (this.header && this.header.clientHeight) || 0;
    const rootHeight = (this.root && this.root.clientHeight) || 0;
    // const bodyHeight = `calc(100% - ${preHeaderHeight + headerHeight}px)`;
    const bodyHeight = rootHeight - (preHeaderHeight + headerHeight);
    this.setState({
      bodyHeight
    });
  }

  updateSizes = () => {
    this.calculateBodyHeight();
    this.setRootWidth();
  };

  handleSort = (data, index) =>
    this.setState(state =>
      this.sortData(
        data,
        { index, order: !state.sortedColumn.order },
        { groupBy: this.props.groupBy, columns: this.props.columns }
      )
    );

  sortData = (data, sortedColumn, { groupBy, columns }) => {
    const comparator = (a, b) => {
      const { accessor } = columns[sortedColumn.index];
      const compare = columns[sortedColumn.index].comparator || defaultCompare;
      return compare(a[accessor], b[accessor], sortedColumn.order);
    };
    const grouped = [];
    if (groupBy) {
      const clearedData = data.filter(d => !d.groupBy_inner);
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

    return {
      sortedData: groupBy ? grouped : [...data].sort(comparator),
      sortedColumn
    };
  };

  renderBodyRow = ({ key, index, style }) => {
    const { columns, odd } = this.props;
    const { sortedData } = this.state;
    const datum = sortedData[index];
    return datum.groupBy_inner ? (
      <Row style={style} grouped key={key} title={datum.groupBy_inner}>
        {datum.groupBy_inner}
      </Row>
    ) : (
      <Row
        style={style}
        key={key}
        columns={columns.length}
        odd={odd}
        widths={columns.map(c => c.width)}
      >
        {columns.map(col => (
          <Cell
            key={col.accessor}
            color={col.color && col.color(datum)}
            title={datum[col.accessor]}
          >
            <TableText>
              {col.renderCell
                ? col.renderCell(datum)
                : getCellContent(datum[col.accessor], col.precision)}
            </TableText>
          </Cell>
        ))}
      </Row>
    );
  };

  render() {
    const { columns, height, odd, preHeader } = this.props;
    const { sortedData, sortedColumn, bodyHeight, rootWidth } = this.state;
    return (
      <div
        ref={e => {
          this.root = e;
        }}
        style={{ height, maxHeight: height }}
      >
        {preHeader && (
          <PreHeader
            innerRef={e => {
              this.preHeader = e;
            }}
          >
            {preHeader.map((datum, index) => (
              <Row
                key={index} //
                columns={columns.length}
                odd={odd}
                widths={columns.map(c => c.width)}
              >
                {columns.map((col, index) => (
                  <Cell
                    key={index}
                    color={col.color && col.color(datum)}
                    title={datum[col.accessor]}
                  >
                    <TableText>
                      {col.renderCell
                        ? col.renderCell(datum)
                        : getCellContent(datum[col.accessor], col.precision)}
                    </TableText>
                  </Cell>
                ))}
              </Row>
            ))}
          </PreHeader>
        )}
        <Header
          columns={columns.length}
          innerRef={header => {
            this.header = header;
          }}
          widths={columns.map(c => c.width)}
        >
          {columns.map(
            (col, index) =>
              col.renderHead ? (
                col.renderHead(col, {
                  sort: () => this.handleSort(sortedData, index)
                })
              ) : (
                <HeadCell
                  preHeader={!!preHeader}
                  key={col.Header || index}
                  onClick={() => this.handleSort(sortedData, index)}
                  sorted={sortedColumn.index === index}
                  order={sortedColumn.order}
                  text={col.Header}
                >
                  <TableText align={col.align}>{col.Header}</TableText>
                </HeadCell>
              )
          )}
        </Header>
        <List
          scrollBarProps={{
            style: {
              width: "100%",
              minHeight: "150px",
              height: `${bodyHeight}px`,
              maxHeight: `${bodyHeight}px`
            },
            className: "scrollbar-table",
            renderThumbVertical: renderCustomThumb
          }}
          rowCount={sortedData.length}
          rowHeight={30}
          height={bodyHeight}
          width={rootWidth}
          renderRow={this.renderBodyRow}
        />
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
  preHeader: PropTypes.array,
  height: PropTypes.string,
  odd: PropTypes.bool,
  groupBy: PropTypes.string,
  initialSort: PropTypes.bool
};

Table.defaultProps = {
  columns: [],
  data: [],
  preHeader: null,
  height: "auto",
  odd: false,
  groupBy: null,
  initialSort: true
};

export default Table;
