import * as actions from './login.actions';
import { ValidationStatus } from '../shared/Utils';
import { LoginActionType } from './actionTypes'


describe('login actions', () => {
  it('deve resetar o estado', () => {
    expect(actions.resetLogin()).toEqual({
      type: LoginActionType.RESET_LOGIN
    });
  });

  it('deve mudar o email', () => {
    expect(actions.changeLoginEmail('e-mail teste')).toEqual({
      type: LoginActionType.CHANGE_LOGIN_EMAIL,
      payload: 'e-mail teste'
    });
  });

  it('deve setar o login validation', () => {
    expect(actions.setLoginEmailValidation(ValidationStatus.ERROR, 'mensagem teste')).toEqual({
      type: LoginActionType.SET_LOGIN_EMAIL_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem teste'
      }
    });
  });

  it('deve setar o email dirty', () => {
    expect(actions.setLoginEmailDirty()).toEqual({
      type: LoginActionType.SET_LOGIN_EMAIL_DIRTY
    });
  });

  it('deve mudar a senha', () => {
    expect(actions.changeLoginSenha('senha teste')).toEqual({
      type: LoginActionType.CHANGE_LOGIN_SENHA,
      payload: 'senha teste'
    });
  });

  it('deve setar a senha validation', () => {
    expect(actions.setLoginSenhaValidation(ValidationStatus.ERROR, 'mensagem teste')).toEqual({
      type: LoginActionType.SET_LOGIN_SENHA_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem teste'
      }
    });
  });

  it('deve setar a senha dirty', () => {
    expect(actions.setLoginSenhaDirty()).toEqual({
      type: LoginActionType.SET_LOGIN_SENHA_DIRTY
    });
  });
});

