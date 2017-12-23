import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Cell, Column, Table } from 'fixed-data-table';
import { ThrottledRenderer } from '../../components';
import '../../../node_modules/fixed-data-table/dist/fixed-data-table.css';
import './App.css';
import { map, reduce } from 'lodash';

@connect(
  state => ({
    rows: state.rows,
    cols: state.cols || new Array(10),
    isDisconnected: state.isDisconnected || false
  })
)

export default class App extends Component {

  state = {
    rows: [],
    cols: new Array(10),
    isDisconnected: false
  };

  componentDidMount() {
    if (socket) {
      socket.on('snapshot', this.onSnapshotReceived);
      socket.on('updates', this.onUpdateReceived);
      socket.on('disconnect', this.onDisconnect);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('snapshot', this.onSnapshotReceived);
      socket.removeListener('updates', this.onUpdateReceived);
      socket.removeListener('disconnect', this.onDisconnect);
    }
  }

  onDisconnect = () => this.setState({ isDisconnected: true });

  onSnapshotReceived = data => {
    const rows = [];
    data.forEach(row => {
      rows[row.id] = reduce(row, (accum, value, key) => {
        accum[key] = { value, trend: 'same' };
        return accum;
      }, {});
    });

    this.setState({rows, cols: Object.keys(rows[0]), isDisconnected: false});
  };

  onUpdateReceived = data => {
    const { rows } = this.state;
    data.forEach(newRow => {
      rows[newRow.id] = reduce(rows[newRow.id], (accum, val, key) => {
        accum[key] = { value: newRow[key] };
        switch (true) {
          case val.value > newRow[key]:
            accum[key].trend = 'down';
            break;
          case val.value < newRow[key]:
            accum[key].trend = 'up';
            break;
          default:
            accum[key].trend = 'same';
            break;
        }
        return accum;
      }, {});
    });

    this.setState({ rows, isDisconnected: false });
  };

  _cell = ({ columnKey, rowIndex }) => {
    const { cols, rows, isDisconnected } = this.state;
    const { value: content, trend } = rows[rowIndex][cols[columnKey]];
    return (
      <Cell className={isDisconnected ? 'disconnected' : trend}>
        {content}
      </Cell>
    );
  };

  _headerCell = ({ columnKey }) => <Cell>{this.state.cols[columnKey]}</Cell>;

  _generateCols = () => map(this.state.cols, (row, index) => {
    return (
      <Column
        width={100}
        flexGrow={1}
        cell={this._cell}
        header={this._headerCell}
        columnKey={index}
        />
    );
  });

  render() {
    return (
      <ThrottledRenderer interval={750}>
        <Table
          rowHeight={30}
          width={window.innerWidth}
          maxHeight={window.innerHeight}
          headerHeight={35}
          rowsCount={this.state.rows.length}
        >
          {this._generateCols()}
        </Table>
      </ThrottledRenderer>
    );
  }
}
