import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { media } from './mixins';

const TableHeadStyle = styled.div`
  display: flex;
  background-color: ${props => props.theme.header.backgroundColor};

  ${props => props.mobile && media.mobile`
    display: none;
  `}
`;

const HeaderRow = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
`;

const TableHead = ({ children, mobile, mobileBreakpoint }) => (
  <TableHeadStyle
    mobile={mobile}
    mobileBreakpoint={mobileBreakpoint}
  >
    <HeaderRow>
      {children}
    </HeaderRow>
  </TableHeadStyle>
);

TableHead.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  mobile: PropTypes.bool,
  mobileBreakpoint: PropTypes.string,
};

TableHead.defaultProps = {
  children: null,
  mobile: false,
  mobileBreakpoint: '600px',
};

export default withTheme(TableHead);
