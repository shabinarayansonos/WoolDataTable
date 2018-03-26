import 'jest-styled-components';

import React from 'react';
import TableHead from '../TableHead';
import { shallowWithTheme } from '../../test-helpers';

test('component <TableHead /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHead />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableHead mobile /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHead mobile />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});

test('component <TableHead mobile mobileBreakpoint /> should render correctly', () => {
  const wrapper = shallowWithTheme(<TableHead mobile mobileBreakpoint="900px" />);
  expect(wrapper.dive().dive()).toMatchSnapshot();
});
