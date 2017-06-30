import { LoginActionType } from './actionTypes'

export const resetLogin = () => {
  return {
    type: LoginActionType.RESET_LOGIN
  }
};

export const changeLoginEmail = (email) => {
  return {
    type: LoginActionType.CHANGE_LOGIN_EMAIL,
    payload: email
  }
};

export const setLoginEmailValidation = (validation, message) => {
  return {
    type: LoginActionType.SET_LOGIN_EMAIL_VALIDATION,
    payload: { validation, message }
  }
};

export const setLoginEmailDirty = () => {
  return { type: LoginActionType.SET_LOGIN_EMAIL_DIRTY }
};

export const changeLoginSenha = (senha) => {
  return {
    type: LoginActionType.CHANGE_LOGIN_SENHA,
    payload: senha
  }
};

export const setLoginSenhaValidation = (validation, message) => {
  return {
    type: LoginActionType.SET_LOGIN_SENHA_VALIDATION,
    payload: { validation, message }
  }
};

export const setLoginSenhaDirty = () => {
  return { type: LoginActionType.SET_LOGIN_SENHA_DIRTY }
};