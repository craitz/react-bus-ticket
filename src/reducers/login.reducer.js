import { ValidationStatus } from '../shared/Utils';

const initialState = {
  email: {
    text: '',
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  },
  senha: {
    text: '',
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_LOGIN': {
      return initialState;
    }
    case 'CHANGE_LOGIN_USER': {
      return {
        ...state,
        email: { ...state.email, text: action.payload }
      }
    }
    case 'CHANGE_LOGIN_PWD': {
      return {
        ...state,
        senha: { ...state.senha, text: action.payload }
      }
    }
    default:
      return state;
  }
}

export default reducer;