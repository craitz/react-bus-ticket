import Immutable from 'seamless-immutable';
import { ValidationStatus } from '../shared/Utils'
import { PerfilUsuarioActionType } from '../actions/actionTypes'

const initialState = Immutable({
  user: {
    nome: {
      text: '',
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    },
    cpf: {
      text: '',
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    }
  },
  edicaoHabilitada: false
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case PerfilUsuarioActionType.CHANGE_NOME: {
      return {
        ...state,
        user: {
          ...state.user,
          nome: {
            ...state.user.nome,
            text: action.payload
          }
        }
      };
    }
    case PerfilUsuarioActionType.SET_NOME_DIRTY: {
      return {
        ...state,
        user: {
          ...state.user,
          nome: {
            ...state.user.nome,
            isPristine: false
          }
        }
      };
    }
    case PerfilUsuarioActionType.SET_NOME_VALIDATION: {
      return {
        ...state,
        user: {
          ...state.user,
          nome: {
            ...state.user.nome,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case PerfilUsuarioActionType.CHANGE_CPF: {
      return {
        ...state,
        user: {
          ...state.user,
          cpf: {
            ...state.user.cpf,
            text: action.payload
          }
        }
      };
    }
    case PerfilUsuarioActionType.SET_CPF_DIRTY: {
      return {
        ...state,
        user: {
          ...state.user,
          cpf: {
            ...state.user.cpf,
            isPristine: false
          }
        }
      };
    }
    case PerfilUsuarioActionType.SET_CPF_VALIDATION: {
      return {
        ...state,
        user: {
          ...state.user,
          cpf: {
            ...state.user.cpf,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case PerfilUsuarioActionType.SET_EDICAO_HABILITADA: {
      return {
        ...state,
        edicaoHabilitada: action.payload
      };
    }
    case PerfilUsuarioActionType.RESET_PERFIL: {
      return { ...initialState };
    }
    default: {
      return state;
    }
  }
}

export default reducer;