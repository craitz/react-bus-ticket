import React from 'react';
import { shallow } from 'enzyme';
import Welcome, {ButtonComprar} from './Welcome';

describe('Welcome VIEW', () => {
  const wrapper = shallow(
    <Welcome />
  );

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});

describe('ButtonComprar', () => {
  const props = {
    handleComprar: jest.fn()
  };
  
  const wrapper = shallow(
    <ButtonComprar {...props}/>
  );

  it('chama a tela de compras', () => {
    const innerButton = wrapper.find('Button');
    innerButton.simulate('click');
    expect(props.handleComprar).toHaveBeenCalledTimes(1);
  });
});