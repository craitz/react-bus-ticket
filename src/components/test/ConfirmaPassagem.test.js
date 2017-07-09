import React from 'react';
import store from '../store';
import renderer from 'react-test-renderer';
import ConfirmaPassagem from './ConfirmaPassagem';
import { shallow } from 'enzyme';

describe('ConfirmaPassagem VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <ConfirmaPassagem store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});