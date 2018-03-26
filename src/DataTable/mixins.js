import { css } from 'styled-components';

export const cellMixin = css`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  flex-grow: ${props => ((props.type === 'checkbox' || props.type === 'expander') ? 0 : props.grow || 1)};
  flex-basis: ${props => ((props.type === 'checkbox' || props.type === 'expander') ? '48px' : props.width || '100px')};
  width: ${props => ((props.type === 'checkbox' || props.type === 'expander') ? '48px' : props.width || '100px')};
  ${props => props.right && 'justify-content: flex-end'};
  ${props => props.center && 'justify-content: center'};
  padding-left: calc(${props => props.theme.cells.cellPadding} / 2);
  padding-right: calc(${props => props.theme.cells.cellPadding} / 2);

  &:first-child {
    padding-left: ${props => props.theme.cells.firstCellPadding};
    ${props => props.type === 'checkbox' && 'padding-left: 8px'};
    ${props => props.type === 'checkbox' && 'padding-right: 0'};
    ${props => props.type === 'expander' && 'padding: 0'};
  }

  &:nth-child(2) {
    ${props => props.type !== 'checkbox' && 'padding-left: 8px'};
    ${props => props.type === 'expander' && 'padding: 0'};
    ${props => props.type === 'cell' && 'padding-left: 8px'};
  }

  ${props => props.compact && 'padding: 0'};

  &:last-child {
    padding-right: ${props => props.theme.cells.lastCellPadding};
  }
`;

/* stylelint-disable */
export const media = {
  mobile: (...args) => css`
    @media all and (max-width: ${props => props.mobileBreakpoint}) {
      ${css(...args)}
    }`,
};
/* stylelint-enable */
