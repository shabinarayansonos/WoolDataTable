import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import TableCell from './TableCell';
import { media } from './mixins';

const TableRowStyle = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  border-top: 1px solid ${props => props.theme.rows.borderColor};

  ${props => props.striped && css`
      &:nth-child(odd) {
        background-color: ${props.theme.rows.stripedColor};
      }
  `};

  ${props => props.highlightOnHover && css`
      &:hover {
        background-color: ${props.theme.rows.hoverColor};
        transition-duration: 0.15s;
        transition-property: background-color;
      }
  `};

  ${props => props.pointerOnHover && css`
      &:hover {
        cursor: pointer;
      }
  `};

  ${props => props.mobile && media.mobile`
    display: block;
    margin-bottom: 5px;
    border: 1px solid ${props.theme.mobileCard.borderColor};
    box-shadow: ${props.theme.mobileCard.shadow};
  `}
`;

const TableRow = ({ striped, highlightOnHover, pointerOnHover, children, columns, keyField, row, index, onRowClicked, mobile, mobileBreakpoint }) => {
  const handleRowClick = e =>
    onRowClicked && onRowClicked(row, index, e);

  return (
    <TableRowStyle
      striped={striped}
      highlightOnHover={highlightOnHover}
      pointerOnHover={pointerOnHover}
      onClick={handleRowClick}
      mobile={mobile}
      mobileBreakpoint={mobileBreakpoint}
    >
      {children}
      {columns.map(col => (
        <TableCell
          type="cell"
          key={`cell-${col.id}-${row[keyField] || index}`}
          width={col.width}
          column={col}
          row={row}
          mobile={mobile}
          mobileBreakpoint={mobileBreakpoint}
        />))}
    </TableRowStyle>
  );
};

TableRow.propTypes = {
  striped: PropTypes.bool,
  highlightOnHover: PropTypes.bool,
  pointerOnHover: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  columns: PropTypes.array.isRequired,
  keyField: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRowClicked: PropTypes.func,
  mobile: PropTypes.bool,
  mobileBreakpoint: PropTypes.string,
};

TableRow.defaultProps = {
  striped: false,
  highlightOnHover: false,
  pointerOnHover: false,
  children: null,
  onRowClicked: null,
  mobile: false,
  mobileBreakpoint: '600px',
};

export default withTheme(TableRow);
