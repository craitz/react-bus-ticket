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
    case 'CHANGE_LOGIN_EMAIL': {
      return {
        ...state,
        email: { ...state.email, text: action.payload }
      }
    }
    case 'SET_LOGIN_EMAIL_VALIDATION': {
      return {
        ...state,
        email: {
          ...state.email,
          validation: action.payload.validation,
          message: action.payload.message
        }
      }
    }
    case 'SET_LOGIN_EMAIL_DIRTY': {
      return {
        ...state,
        email: { ...state.email, isPristine: false }
      }
    }
    case 'CHANGE_LOGIN_SENHA': {
      return {
        ...state,
        senha: { ...state.senha, text: action.payload }
      }
    }
    case 'SET_LOGIN_SENHA_VALIDATION': {
      return {
        ...state,
        senha: {
          ...state.senha,
          validation: action.payload.validation,
          message: action.payload.message
        }
      }
    }
    case 'SET_LOGIN_SENHA_DIRTY': {
      return {
        ...state,
        senha: { ...state.senha, isPristine: false }
      }
    }
    default:
      return state;
  }
}

export default reducer;