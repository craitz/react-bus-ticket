import React from 'react';
import store from '../store';
import { shallow } from 'enzyme';
import Layout from './Layout';

describe('Layout VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <Layout store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});