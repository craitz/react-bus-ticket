import { ValidationStatus } from '../shared/Utils';
import { LoginActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

export const initialState = Immutable({
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

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LoginActionType.RESET_LOGIN: {
      return { ...initialState };
    }
    case LoginActionType.CHANGE_LOGIN_EMAIL: {
      return {
        ...state,
        email: { ...state.email, text: action.payload }
      }
    }
    case LoginActionType.SET_LOGIN_EMAIL_VALIDATION: {
      return {
        ...state,
        email: {
          ...state.email,
          validation: action.payload.validation,
          message: action.payload.message
        }
      }
    }
    case LoginActionType.SET_LOGIN_EMAIL_DIRTY: {
      return {
        ...state,
        email: { ...state.email, isPristine: false }
      }
    }
    case LoginActionType.CHANGE_LOGIN_SENHA: {
      return {
        ...state,
        senha: { ...state.senha, text: action.payload }
      }
    }
    case LoginActionType.SET_LOGIN_SENHA_VALIDATION: {
      return {
        ...state,
        senha: {
          ...state.senha,
          validation: action.payload.validation,
          message: action.payload.message
        }
      }
    }
    case LoginActionType.SET_LOGIN_SENHA_DIRTY: {
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