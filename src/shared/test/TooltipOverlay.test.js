import React from 'react';
import store from '../store';
import { shallow } from 'enzyme';
import TooltipOverlay from './TooltipOverlay';

describe('TooltipOverlay VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <TooltipOverlay />
    );
    expect(wrapper).toMatchSnapshot();
  });
});