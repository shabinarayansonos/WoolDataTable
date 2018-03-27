import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import orderBy from 'lodash/orderBy';
import pullAllBy from 'lodash/pullAllBy';
import merge from 'lodash/merge';
import shortid from 'shortid';
import Table from './Table';
import TableHead from './TableHead';
import TableRow from './TableRow';
import TableCol from './TableCol';
import TableCell from './TableCell';
import ExpanderRow from './ExpanderRow';
import TableHeader from './TableHeader';
import ResponsiveWrapper from './ResponsiveWrapper';
import ProgressWrapper from './ProgressWrapper';
import TableWrapper from './TableWrapper';
import NoData from './NoData';
import { decorateColumns, insertItem, removeItem, getSortDirection } from './util';
import defaultTheme from '../themes/default';

class DataTable extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    selectableRows: PropTypes.bool,
    expandableRows: PropTypes.bool,
    keyField: PropTypes.string,
    progressPending: PropTypes.bool,
    progressComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    progressCentered: PropTypes.bool,
    expanderStateField: PropTypes.string,
    expandableRowsComponent: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]),
    selectableRowsComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    selectableRowsComponentProps: PropTypes.object,
    customTheme: PropTypes.object,
    sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    striped: PropTypes.bool,
    highlightOnHover: PropTypes.bool,
    pointerOnHover: PropTypes.bool,
    onServerSort: PropTypes.func,
    contextTitle: PropTypes.string,
    contextActions: PropTypes.arrayOf(PropTypes.node),
    onTableUpdate: PropTypes.func,
    clearSelectedRows: PropTypes.bool,
    defaultSortField: PropTypes.string,
    defaultSortAsc: PropTypes.bool,
    columns: PropTypes.array,
    data: PropTypes.array,
    className: PropTypes.string,
    style: PropTypes.object,
    responsive: PropTypes.bool,
    overflowY: PropTypes.bool,
    overflowYOffset: PropTypes.string,
    noDataComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
      PropTypes.func,
    ]),
    disabled: PropTypes.bool,
    noHeader: PropTypes.bool,
    onRowClicked: PropTypes.func,
    mobile: PropTypes.bool,
    mobileBreakpoint: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    keyField: 'id',
    selectableRows: false,
    expandableRows: false,
    progressPending: false,
    progressComponent: <h2>Loading...</h2>,
    progressCentered: false,
    expanderStateField: '$$expander',
    expandableRowsComponent: <div>Add a custom expander component. Use props.data for row data</div>,
    selectableRowsComponent: 'input',
    selectableRowsComponentProps: {},
    customTheme: {},
    sortIcon: false,
    striped: false,
    highlightOnHover: false,
    pointerOnHover: false,
    onServerSort: null,
    contextTitle: '',
    contextActions: [],
    onTableUpdate: null,
    clearSelectedRows: false,
    defaultSortField: null,
    defaultSortAsc: true,
    columns: [],
    data: [],
    className: null,
    style: {},
    responsive: true,
    overflowY: false,
    overflowYOffset: '250px',
    noDataComponent: 'There are no records to display',
    disabled: false,
    noHeader: false,
    onRowClicked: null,
    mobile: false,
    mobileBreakpoint: '600px',
  };

  constructor(props) {
    super(props);

    const sortDirection = getSortDirection(props.defaultSortAsc);
    // only initially sort rows if initial sort field is provided
    const sortedRows = props.defaultSortField ?
      orderBy(props.data, props.defaultSortField, sortDirection) : props.data;

    this.columns = decorateColumns(props.columns);

    this.state = {
      allSelected: false,
      selectedCount: 0,
      selectedRows: [],
      sortColumn: props.defaultSortField,
      sortDirection,
      rows: sortedRows,
    };
  }

  componentWillReceiveProps(nextProps) {
    // allow clearing of rows via passed clearSelectedRows prop
    if (nextProps.clearSelectedRows !== this.props.clearSelectedRows) {
      this.setState(() => ({
        allSelected: false,
        selectedCount: 0,
        selectedRows: [],
      }));
    }

    // Keep data state in sync if it changes
    if (nextProps.data !== this.props.data) {
      this.setState(state => ({ rows: orderBy(nextProps.data, state.sortColumn, state.sortDirection) }));
    }

    // Keep sort default states in sync if it changes
    if (nextProps.defaultSortAsc !== this.props.defaultSortAsc
      || nextProps.defaultSortField !== this.props.defaultSortField) {
      this.setState({
        sortDirection: getSortDirection(nextProps.defaultSortAsc),
        sortColumn: nextProps.defaultSortField,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.onTableUpdate && nextState !== this.state) {
      nextProps.onTableUpdate(nextState);
    }
  }

  generateDefaultContextTitle() {
    const { contextTitle } = this.props;
    const { selectedCount } = this.state;

    return contextTitle || `${selectedCount} item${selectedCount > 1 ? 's' : ''} selected`;
  }

  determineExpanderRowIdentifier(row) {
    const { keyField } = this.props;

    return row[keyField] ? row[keyField] : row;
  }

  handleSelectAll = () => {
    this.setState(state => {
      const allSelected = !state.allSelected;

      return {
        allSelected,
        selectedCount: allSelected ? this.state.rows.length : 0,
        selectedRows: allSelected ? this.state.rows : [],
      };
    });
  }

  handleRowChecked = row => {
    if (this.state.selectedRows.find(r => r === row)) {
      this.setState(state => ({
        selectedCount: state.selectedRows.length > 0 ? state.selectedRows.length - 1 : 0,
        allSelected: false,
        selectedRows: removeItem(state.selectedRows, row),
      }));
    } else {
      this.setState(state => ({
        selectedCount: state.selectedRows.length + 1,
        allSelected: state.selectedRows.length + 1 === state.rows.length,
        selectedRows: insertItem(state.selectedRows, row),
      }));
    }
  }

  handleRowClicked = (row, index, e) => {
    if (this.props.onRowClicked) {
      this.props.onRowClicked(row, index, e);
    }
  }

  toggleExpand = row => {
    const {
      keyField,
      expanderStateField,
    } = this.props;

    const identifier = this.determineExpanderRowIdentifier(row);
    const expandedRow = this.state.rows.find(r => r[expanderStateField] && r.parent === identifier);

    if (expandedRow) {
      this.setState(state => ({
        rows: removeItem(state.rows, expandedRow),
      }));
    } else {
      const parentRowIndex = this.state.rows.findIndex(r => r === row);

      this.setState(state => ({
        // insert a new expander row
        rows: insertItem(state.rows, {
          [keyField]: shortid.generate(),
          parent: identifier,
          [expanderStateField]: true,
        }, parentRowIndex + 1),
      }));
    }
  }

  handleSort = ({ selector, sortable }) => {
    const {
      expandableRows,
      expanderStateField,
      onServerSort,
    } = this.props;

    if (sortable) {
      this.setState(() => {
        const { sortDirection, rows } = this.state;
        const direction = sortDirection === 'asc' ? 'desc' : 'asc';
        const handleRows = () => {
          if (expandableRows) {
            const removedExpands = pullAllBy(rows, rows.filter(r => r[expanderStateField]));

            return orderBy(removedExpands, selector, direction);
          }

          return orderBy(rows, selector, direction);
        };

        return {
          sortColumn: selector,
          sortDirection: direction,
          rows: handleRows(),
        };
      });
    }

    if (sortable && onServerSort) {
      this.props.onServerSort(this.state.sortColumn, this.state.sortDirection);
    }
  }

  renderColumns() {
    const {
      sortIcon,
    } = this.props;

    const {
      sortColumn,
      sortDirection,
    } = this.state;

    return (
      this.columns.map(col => (
        <TableCol
          key={col.id}
          type="column"
          column={col}
          onColumnClick={this.handleSort}
          sortable={col.sortable && sortColumn === col.selector}
          sortField={sortColumn}
          sortDirection={sortDirection}
          sortIcon={sortIcon}
        />))
    );
  }

  renderRows() {
    const {
      selectableRows,
      expandableRows,
      expandableRowsComponent,
      expanderStateField,
      striped,
      highlightOnHover,
      keyField,
      pointerOnHover,
      mobile,
      mobileBreakpoint,
    } = this.props;

    const {
      rows,
    } = this.state;
    const getExpanderRowbByParentId = parent => rows.find(r => r.id === parent);

    return (
      rows.map((row, index) => {
        if (row[expanderStateField]) {
          return (
            <ExpanderRow
              key={`expander--${row[keyField]}`}
              data={getExpanderRowbByParentId(row.parent)}
            >
              {expandableRowsComponent}
            </ExpanderRow>
          );
        }

        return (
          <TableRow
            key={row[this.props.keyField] || index}
            striped={striped}
            highlightOnHover={highlightOnHover}
            pointerOnHover={pointerOnHover}
            columns={this.columns}
            row={row}
            index={index}
            keyField={keyField}
            onRowClicked={this.handleRowClicked}
            mobile={mobile}
            mobileBreakpoint={mobileBreakpoint}
          >
            {selectableRows && this.renderSelectableRows(row, index)}
            {expandableRows && this.renderExpanderCell(row, index)}
          </TableRow>
        );
      })
    );
  }

  renderExpanderCell(row, index) {
    const identifier = this.determineExpanderRowIdentifier(row);
    const getExpanderRowParentById = id => this.state.rows.findIndex(r => id === r.parent);

    return (
      <TableCell
        type="expander"
        onToggled={this.toggleExpand}
        expanded={getExpanderRowParentById(identifier) > -1}
        row={row}
        index={index}
      />
    );
  }

  renderSelectableRows(row, index) {
    const {
      selectableRowsComponent,
      selectableRowsComponentProps,
    } = this.props;

    const isChecked = this.state.selectedRows.indexOf(this.state.rows[index]) > -1;

    return (
      <TableCell
        type="checkbox"
        checked={isChecked}
        checkboxComponent={selectableRowsComponent}
        checkboxComponentOptions={selectableRowsComponentProps}
        onClick={this.handleRowChecked}
        row={row}
      />
    );
  }

  renderTableHead() {
    const {
      selectableRows,
      selectableRowsComponent,
      selectableRowsComponentProps,
      expandableRows,
      mobile,
      mobileBreakpoint,
    } = this.props;

    const {
      selectedRows,
      allSelected,
    } = this.state;

    const isIndeterminate = selectedRows.length > 0 && !allSelected;

    return (
      <TableHead mobile={mobile} mobileBreakpoint={mobileBreakpoint}>
        {selectableRows &&
          <TableCol
            type="checkbox"
            onClick={this.handleSelectAll}
            checked={allSelected}
            checkboxComponent={selectableRowsComponent}
            checkboxComponentOptions={selectableRowsComponentProps}
            indeterminate={isIndeterminate}
          />}
        {expandableRows && <TableCol type="expander" />}
        {this.renderColumns()}
      </TableHead>
    );
  }

  render() {
    const {
      title,
      customTheme,
      contextActions,
      className,
      style,
      responsive,
      overflowY,
      overflowYOffset,
      progressPending,
      progressComponent,
      progressCentered,
      noDataComponent,
      disabled,
      noHeader,
    } = this.props;

    const {
      rows,
      selectedCount,
    } = this.state;

    const theme = merge(defaultTheme, customTheme);

    return (
      <ThemeProvider theme={theme}>
        <ResponsiveWrapper
          responsive={responsive}
          className={className}
          style={style}
          overflowYOffset={overflowYOffset}
          overflowY={overflowY}
        >
          {!noHeader &&
            <TableHeader
              title={title}
              showContextMenu={selectedCount > 0}
              contextTitle={this.generateDefaultContextTitle()}
              contextActions={contextActions}
            />}

          <TableWrapper>
            {progressPending &&
              <ProgressWrapper
                component={progressComponent}
                centered={progressCentered}
              />}

            {!rows.length > 0 && !progressPending &&
              <NoData component={noDataComponent} />}

            {rows.length > 0 &&
              <Table disabled={disabled}>
                {this.renderTableHead()}
                {this.renderRows()}
              </Table>}
          </TableWrapper>
        </ResponsiveWrapper>
      </ThemeProvider>
    );
  }
}

export default DataTable;
