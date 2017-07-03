import React from 'react';
import store from '../store';
import { shallow } from 'enzyme';
import Login, { LoginInputGroup, ButtonLogin } from './Login';
import { ValidationStatus } from '../shared/Utils';
import Immutable from 'seamless-immutable';


describe('Login VIEW', () => {
  it('renders correctly', () => {
    const loginWrapper = shallow(
      <Login store={store} />
    );
    expect(loginWrapper).toMatchSnapshot();
  });
});

describe('LoginInputGroup', () => {
  const props = Immutable({
    id: "email",
    type: "text",
    field: {
      text: 'guest@busticket.com',
      isPristine: false,
      validation: ValidationStatus.NONE,
      message: ''
    },
    glyph: "user",
    placeholder: "E-mail",
    onChange: jest.fn()
  });

  it('renders correctly', () => {
    const loginInputGroupWrapper = shallow(
      <LoginInputGroup {...props} />
    );
    expect(loginInputGroupWrapper).toMatchSnapshot();
  });

  it('muda o valor do input', () => {
    const loginInputGroupWrapper = shallow(
      <LoginInputGroup {...props} />
    );

    const input = loginInputGroupWrapper.find('FormControl');
    const event = {
      target: {
        value: 'teste'
      }
    };

    input.simulate('change', event);
    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith(event);
  });
});

describe('ButtonLogin', () => {
  const props = {
    handleLogin: jest.fn()
  }

  it('renders correctly', () => {
    const buttonLoginWrapper = shallow(
      <ButtonLogin {...props} />
    );
    expect(buttonLoginWrapper).toMatchSnapshot();
  });

  it('chama o login', () => {
    const buttonLoginWrapper = shallow(
      <ButtonLogin {...props} />
    );
    const innerButton = buttonLoginWrapper.find('Button');
    innerButton.simulate('click');
    expect(props.handleLogin).toHaveBeenCalledTimes(1);
  });
});