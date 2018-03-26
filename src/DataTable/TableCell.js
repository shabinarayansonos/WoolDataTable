import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import Checkbox from './Checkbox';
import ExpanderButton from './ExpanderButton';
import { getProperty } from './util';
import { cellMixin, media } from './mixins';

const CellWrapper = styled.div`
  ${props => props.mobile && media.mobile`
    display: flex;
    width: 100%;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
  `}

  .cell_wapper_mobile-header {
    display: none;
    ${props => props.mobile && media.mobile`
      display: flex;
      justify-content: flex-start;
      font-weight: bold;
      flex: 0 0 40%;
      max-width: 40%;
    `}
  }

  .cell_wapper_content {
    ${props => props.mobile && media.mobile`
      display: flex;
      justify-content: flex-end;
      text-align: right;
      flex: 0 0 60%;
      max-width: 60%;
    `}
  }
`;

const TableCellStyle = styled.div`
  ${() => cellMixin};
  line-height: normal;
  font-weight: 400;
  font-size: ${props => props.theme.rows.fontSize};
  color: ${props => props.theme.rows.fontColor};
  min-height: ${props => props.theme.rows.height};
  white-space: ${props => (props.wrap ? 'normal' : 'nowrap')};

  ${props => !props.allowOverflow && css`
    div,
    span,
    p {
      text-overflow: ellipsis;
      overflow: hidden;
      min-width: 0;
    }
  `};

  ${props => props.mobile && media.mobile`
    justify-content: flex-end;
    padding-left: 16px !important;
    padding-right: 16px !important;
    text-align: left;
    white-space: normal;
    width: 100%;

    &:first-child {
      ${props.type === 'checkbox' && 'justify-content: center'};
      ${props.type === 'expander' && 'justify-content: center'};
    }

    &:nth-child(2) {
      ${props.type === 'expander' && 'padding: 0'};
      ${props.type === 'cell' && 'padding-left: 0px'};
    }

    &:nth-child(n+2) {
      border-top: 1px solid ${props.theme.rows.borderColor};
    }
  `}
`;

class TableCell extends PureComponent {
  static propTypes = {
    column: PropTypes.object,
    row: PropTypes.object,
    index: PropTypes.number,
    type: PropTypes.oneOf(['checkbox', 'cell', 'expander']),
    checked: PropTypes.bool,
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    onClick: PropTypes.func,
    onToggled: PropTypes.func,
    expanded: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    mobile: PropTypes.bool,
    mobileBreakpoint: PropTypes.string,
  };

  static defaultProps = {
    column: {},
    row: {},
    index: null,
    type: null,
    checkboxComponent: null,
    checked: false,
    checkboxComponentOptions: {},
    onClick: null,
    onToggled: null,
    expanded: false,
    children: null,
    mobile: false,
    mobileBreakpoint: '600px',
  };

  handleCellClick = e => {
    const { type, column } = this.props;

    if (type === 'checkbox' || type === 'expander' || column.ignoreRowClick) {
      e.stopPropagation();
    }
  };

  renderChildren() {
    const {
      column,
      row,
      type,
      checked,
      checkboxComponent,
      checkboxComponentOptions,
      onClick,
      onToggled,
      expanded,
      index,
      children,
    } = this.props;

    switch (type) {
      case 'checkbox':
        return (
          <Checkbox
            name="select-row"
            aria-label="select-row"
            component={checkboxComponent}
            componentOptions={checkboxComponentOptions}
            checked={checked}
            onClick={onClick}
            data={row}
          />
        );
      case 'cell':
        return column.cell ? column.cell(row) : getProperty(row, column.selector, column.format);
      case 'expander':
        return (
          <ExpanderButton
            onToggled={onToggled}
            data={row}
            expanded={expanded}
            index={index}
          />
        );
      default:
        return children;
    }
  }

  render() {
    const {
      column,
      type,
      mobile,
      mobileBreakpoint,
    } = this.props;

    return (
      <TableCellStyle
        type={type}
        onClick={this.handleCellClick}
        column={column}
        width={column.width}
        minWidth={column.minWidth}
        grow={column.grow}
        truncate={column.truncate}
        right={column.right}
        center={column.center}
        compact={column.compact}
        allowOverflow={column.allowOverflow}
        wrap={column.wrap}
        mobile={mobile}
        mobileBreakpoint={mobileBreakpoint}
      >
        <CellWrapper
          mobile={mobile}
          mobileBreakpoint={mobileBreakpoint}
        >
          <div className="cell_wapper_mobile-header">
            {column.name}
          </div>
          <div className="cell_wapper_content">
            {this.renderChildren()}
          </div>
        </CellWrapper>
      </TableCellStyle>
    );
  }
}

export default withTheme(TableCell);
