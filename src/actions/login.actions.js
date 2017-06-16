export const resetLogin = () => {
  return {
    type: 'RESET_LOGIN'
  }
};

export const changeLoginUser = (user) => {
  return {
    type: 'CHANGE_LOGIN_USER',
    payload: user
  }
};

export const changeLoginPwd = (pwd) => {
  return {
    type: 'CHANGE_LOGIN_PWD',
    payload: pwd
  }
};