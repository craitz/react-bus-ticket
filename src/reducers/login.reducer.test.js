import reducer from './login.reducer';
import { ValidationStatus } from '../shared/Utils';
import { LoginActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  email: {
    text: 'guest@busticket.com',
    isPristine: false,
    validation: ValidationStatus.NONE,
    message: ''
  },
  senha: {
    text: '#guest#',
    isPristine: false,
    validation: ValidationStatus.NONE,
    message: ''
  }
});

const merge = (obj) => {
  return initialState.merge(obj, { deep: true });
}

const changeEmailAfterState = merge({
  email: { text: 'teste@gamail.com' }
});

const changeEmailDirtyAfterState = merge({
  email: { isPristine: false }
});

const changeEmailValidationAfterState = merge({
  email: {
    validation: ValidationStatus.ERROR,
    message: 'mensagem teste'
  }
});

const changeSenhaAfterState = merge({
  senha: { text: 'testando123' }
});

const changeSenhaDirtyAfterState = merge({
  senha: { isPristine: false }
});

const changeSenhaValidationAfterState = merge({
  senha: {
    validation: ValidationStatus.ERROR,
    message: 'mensagem teste'
  }
});

describe('login reducer', () => {
  it('deve ter estado inicial', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('não deve alterar estado', () => {
    expect(reducer(initialState, { type: 'ACTION_INVALIDO' }))
      .toEqual(initialState);
  });

  it('deve resetar o estado', () => {
    expect(reducer(initialState, { type: LoginActionType.RESET_LOGIN }))
      .toEqual(initialState);
  });

  it('deve mudar o e-mail', () => {
    expect(reducer(initialState, {
      type: LoginActionType.CHANGE_LOGIN_EMAIL,
      payload: 'teste@gamail.com'
    })).toEqual(changeEmailAfterState);
  });

  it('deve mudar o e-mail dirty', () => {
    expect(reducer(initialState, { type: LoginActionType.SET_LOGIN_EMAIL_DIRTY }))
      .toEqual(changeEmailDirtyAfterState);
  });

  it('deve mudar o e-mail validation', () => {
    expect(reducer(initialState, {
      type: LoginActionType.SET_LOGIN_EMAIL_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem teste'
      }
    })).toEqual(changeEmailValidationAfterState);
  });

  it('deve mudar a senha', () => {
    expect(reducer(initialState, {
      type: LoginActionType.CHANGE_LOGIN_SENHA,
      payload: 'testando123'
    })).toEqual(changeSenhaAfterState);
  });

  it('deve mudar a senha dirty', () => {
    expect(reducer(initialState, { type: LoginActionType.SET_LOGIN_SENHA_DIRTY }))
      .toEqual(changeSenhaDirtyAfterState);
  });

  it('deve mudar a senha validation', () => {
    expect(reducer(initialState, {
      type: LoginActionType.SET_LOGIN_SENHA_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem teste'
      }
    })).toEqual(changeSenhaValidationAfterState);
  });
});