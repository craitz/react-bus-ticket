export const resetLogin = () => {
  return {
    type: 'RESET_LOGIN'
  }
};

export const changeLoginEmail = (email) => {
  return {
    type: 'CHANGE_LOGIN_EMAIL',
    payload: email
  }
};

export const setLoginEmailValidation = (validation, message) => {
  return {
    type: 'SET_LOGIN_EMAIL_VALIDATION',
    payload: { validation, message }
  }
};

export const setLoginEmailDirty = () => {
  return { type: 'SET_LOGIN_EMAIL_DIRTY' }
};

export const changeLoginSenha = (senha) => {
  return {
    type: 'CHANGE_LOGIN_SENHA',
    payload: senha
  }
};

export const setLoginSenhaValidation = (validation, message) => {
  return {
    type: 'SET_LOGIN_SENHA_VALIDATION',
    payload: { validation, message }
  }
};

export const setLoginSenhaDirty = () => {
  return { type: 'SET_LOGIN_SENHA_DIRTY' }
};