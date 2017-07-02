import React from 'react';
import store from '../store';
import CompraPassagem from './CompraPassagem';
import { shallow } from 'enzyme';
// import configureStore from 'redux-mock-store';

describe('CompraPassagem VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <CompraPassagem store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
