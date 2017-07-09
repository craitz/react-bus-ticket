import React from 'react';
import store from '../store';
import { shallow } from 'enzyme';
import DivAnimated from './DivAnimated';

describe('DivAnimated VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <DivAnimated />
    );
    expect(wrapper).toMatchSnapshot();
  });
});