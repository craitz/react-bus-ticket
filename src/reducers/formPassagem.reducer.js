import { DateNowBr, ValidationStatus } from '../shared/Utils'

const initialState = {
  passagem: {
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
    },
    email: '',
    origem: {
      val: 0,
      text: '',
    },
    destino: {
      val: 1,
      text: '',
    },
    poltrona: {
      value: [],
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    },
    data: DateNowBr,
    horario: {
      val: 0,
      text: '',
    }
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'RESET_FORM_PASSAGEM': {
      return initialState;
    }
    case 'CHANGE_NOME': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          nome: {
            ...state.passagem.nome,
            text: action.payload
          }
        }
      };
    }
    case 'SET_NOME_PRISTINE': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          nome: {
            ...state.passagem.nome,
            isPristine: true
          }
        }
      };
    }
    case 'SET_NOME_DIRTY': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          nome: {
            ...state.passagem.nome,
            isPristine: false
          }
        }
      };
    }
    case 'SET_NOME_VALIDATION': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          nome: {
            ...state.passagem.nome,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case 'CHANGE_CPF': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          cpf: {
            ...state.passagem.cpf,
            text: action.payload
          }
        }
      };
    }
    case 'SET_CPF_PRISTINE': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          cpf: {
            ...state.passagem.cpf,
            isPristine: true
          }
        }
      };
    }
    case 'SET_CPF_DIRTY': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          cpf: {
            ...state.passagem.cpf,
            isPristine: false
          }
        }
      };
    }
    case 'SET_CPF_VALIDATION': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          cpf: {
            ...state.passagem.cpf,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case 'CHANGE_EMAIL': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          email: action.payload
        }
      };
    }
    case 'CHANGE_ORIGEM': {
      return {
        ...state,
        passagem: { ...state.passagem, origem: action.payload }
      };
    }
    case 'CHANGE_DESTINO': {
      return {
        ...state,
        passagem: { ...state.passagem, destino: action.payload }
      };
    }
    case 'CHANGE_POLTRONA': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          poltrona: {
            ...state.passagem.poltrona,
            value: action.payload
          }
        }
      };
    }
    case 'SET_POLTRONA_PRISTINE': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          poltrona: {
            ...state.passagem.poltrona,
            isPristine: true
          }
        }
      };
    }
    case 'SET_POLTRONA_DIRTY': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          poltrona: {
            ...state.passagem.poltrona,
            isPristine: false
          }
        }
      };
    }
    case 'SET_POLTRONA_VALIDATION': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          poltrona: {
            ...state.passagem.poltrona,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case 'CHANGE_DATA': {
      return {
        ...state,
        passagem: { ...state.passagem, data: action.payload }
      };
    }
    case 'CHANGE_HORARIO': {
      return {
        ...state,
        passagem: { ...state.passagem, horario: action.payload }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;