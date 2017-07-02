import React from 'react';
import store from '../store';
import { shallow } from 'enzyme';
import Navigation from './Navigation';

describe('Navigation VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Navigation />
    );
    expect(wrapper).toMatchSnapshot();
  });
});