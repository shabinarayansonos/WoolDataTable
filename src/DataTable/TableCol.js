import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme, css } from 'styled-components';
import Checkbox from './Checkbox';
import { cellMixin } from './mixins';

const TableColStyle = styled.div`
  ${() => cellMixin};
  white-space: nowrap;
  user-select: none;
  font-weight: 500;
  height: ${props => props.theme.header.height};
  font-size: ${props => props.theme.header.fontSize};
  color: ${props => props.theme.header.fontColor};
  ${props => props.sortable && 'cursor: pointer'};

  &::before {
    font-size: 12px;
    padding-right: 4px;
  }

  /* default sorting when no icon is specified */
  ${props => props.sortable && props.sortDirection === 'asc' && !props.sortIcon &&
    css`
      &::before {
        content: '\\25B2';
      }
  `};
  ${props => props.sortable && props.sortDirection === 'desc' && !props.sortIcon &&
    css`
      &::before {
        content: '\\25BC';
      }
  `};
`;

const ColumnCellWrapper = styled.div`
  margin-left: -3px;
  display: inline-flex;
  align-items: center;
`;

const SortIcon = styled.span`
  i,
  svg {
    font-size: 18px !important;
    line-height: 24px;
    flex-grow: 0;
    flex-shrink: 0;
    transition-duration: 0.1s;
    transition-property: transform;
    transform: rotate(180deg);
  }

  &.desc i,
  svg {
    transform: rotate(0);
  }
`;

class TableCol extends PureComponent {
  static propTypes = {
    onColumnClick: PropTypes.func,
    column: PropTypes.object,
    sortable: PropTypes.bool,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),
    sortIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    type: PropTypes.oneOf(['checkbox', 'expander', 'column']),
    checkboxComponent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    checkboxComponentOptions: PropTypes.object,
    checked: PropTypes.bool,
    indeterminate: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onColumnClick: () => {},
    column: {},
    sortable: false,
    sortDirection: 'asc',
    sortIcon: false,
    type: 'column',
    checkboxComponent: null,
    checkboxComponentOptions: {},
    checked: false,
    indeterminate: false,
    onClick: null,
  };

  onColumnClick = e => {
    const {
      column,
      onColumnClick,
    } = this.props;

    if (onColumnClick) {
      onColumnClick(column, e);
    }
  }

  renderChildren() {
    const {
      type,
      column,
      checked,
      checkboxComponent,
      checkboxComponentOptions,
      indeterminate,
      onClick,
      sortable,
      sortIcon,
      sortDirection,
    } = this.props;

    if (type === 'checkbox') {
      return (
        <Checkbox
          name="select-all-rows"
          aria-label="select-all-rows"
          component={checkboxComponent}
          componentOptions={checkboxComponentOptions}
          onClick={onClick}
          checked={checked}
          indeterminate={indeterminate}
        />
      );
    }

    const direction = sortDirection === 'asc' ? 'asc' : 'desc';

    return (
      column.name ?
        <ColumnCellWrapper>
          {sortable && sortIcon &&
          <SortIcon className={direction}>
            {sortIcon}
          </SortIcon>}
          {column.name}
        </ColumnCellWrapper> : null
    );
  }

  render() {
    const {
      column,
      sortable,
      sortIcon,
      sortDirection,
      type,
    } = this.props;

    return (
      <TableColStyle
        type={type}
        onClick={this.onColumnClick}
        sortable={sortable}
        sortDirection={sortDirection}
        sortIcon={sortIcon}
        column={column}
        width={column.width}
        minWidth={column.minWidth}
        grow={column.grow}
        truncate={column.truncate}
        right={column.right}
        center={column.center}
        compact={column.compact}
      >
        {this.renderChildren()}
      </TableColStyle>
    );
  }
}

export default withTheme(TableCol);
