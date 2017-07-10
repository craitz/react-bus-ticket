import Immutable from 'seamless-immutable';
import { DateNowBr, ValidationStatus } from '../shared/Utils'
import { CompraPassagemActionType } from '../actions/actionTypes'

export const passagemInitialState = Immutable({
  nome: {
    text: '',
  },
  cpf: {
    text: '',
  },
  origem: {
    value: '0',
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  },
  destino: {
    value: '1',
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  },
  poltrona: {
    value: '',
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  },
  data: {
    value: DateNowBr,
    isPristine: true,
    validation: ValidationStatus.NONE,
    message: ''
  },
  horario: {
    val: 0,
    text: '',
  },
  dataCompra: DateNowBr
});

export const initialState = Immutable({
  cidades: [],
  horarios: [],
  poltronas: [],
  isIdaVolta: false,
  passagem: { ...passagemInitialState },
  passagemVolta: { ...passagemInitialState }
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CompraPassagemActionType.SET_CIDADES: {
      return { ...state, cidades: action.payload };
    }
    case CompraPassagemActionType.SET_HORARIOS: {
      return { ...state, horarios: action.payload };
    }
    case CompraPassagemActionType.SET_POLTRONAS: {
      return { ...state, poltronas: action.payload };
    }
    case CompraPassagemActionType.SET_IDA_VOLTA: {
      return { ...state, isIdaVolta: action.payload };
    }
    case CompraPassagemActionType.RESET_FORM_PASSAGEM: {
      return {
        ...state,
        passagem: { ...passagemInitialState },
        passagemVolta: { ...passagemInitialState }
      }
    }
    case CompraPassagemActionType.CHANGE_NOME: {
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
    case CompraPassagemActionType.SET_NOME_DIRTY: {
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
    case CompraPassagemActionType.SET_NOME_VALIDATION: {
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
    case CompraPassagemActionType.CHANGE_CPF: {
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
    case CompraPassagemActionType.SET_CPF_DIRTY: {
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
    case CompraPassagemActionType.SET_CPF_VALIDATION: {


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
    case CompraPassagemActionType.CHANGE_ORIGEM: {
      return {
        ...state,
        passagem:
        {
          ...state.passagem,
          origem: {
            ...state.passagem.origem,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_ORIGEM_VOLTA: {
      return {
        ...state,
        passagemVolta:
        {
          ...state.passagemVolta,
          origem: {
            ...state.passagemVolta.origem,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_ORIGEM_DIRTY: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          origem: {
            ...state.passagem.origem,
            isPristine: false
          }
        }
      };
    }
    case CompraPassagemActionType.SET_ORIGEM_VALIDATION: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          origem: {
            ...state.passagem.origem,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_DESTINO: {
      return {
        ...state,
        passagem:
        {
          ...state.passagem,
          destino: {
            ...state.passagem.destino,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_DESTINO_VOLTA: {
      return {
        ...state,
        passagemVolta:
        {
          ...state.passagemVolta,
          destino: {
            ...state.passagemVolta.destino,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DESTINO_DIRTY: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          destino: {
            ...state.passagem.destino,
            isPristine: false
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DESTINO_VALIDATION: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          destino: {
            ...state.passagem.destino,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_POLTRONA: {
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
    case CompraPassagemActionType.CHANGE_POLTRONA_VOLTA: {
      return {
        ...state,
        passagemVolta: {
          ...state.passagemVolta,
          poltrona: {
            ...state.passagemVolta.poltrona,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_POLTRONA_DIRTY: {
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
    case CompraPassagemActionType.SET_POLTRONA_VALIDATION: {
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
    case CompraPassagemActionType.CHANGE_DATA: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          data: {
            ...state.passagem.data,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DATA_DIRTY: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          data: {
            ...state.passagem.data,
            isPristine: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DATA_VALIDATION: {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          data: {
            ...state.passagem.data,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_DATA_VOLTA: {
      return {
        ...state,
        passagemVolta: {
          ...state.passagemVolta,
          data: {
            ...state.passagemVolta.data,
            value: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DATA_VOLTA_DIRTY: {
      return {
        ...state,
        passagemVolta: {
          ...state.passagemVolta,
          data: {
            ...state.passagemVolta.data,
            isPristine: action.payload
          }
        }
      };
    }
    case CompraPassagemActionType.SET_DATA_VOLTA_VALIDATION: {
      return {
        ...state,
        passagemVolta: {
          ...state.passagemVolta,
          data: {
            ...state.passagemVolta.data,
            validation: action.payload.validation,
            message: action.payload.message
          }
        }
      };
    }
    case CompraPassagemActionType.CHANGE_HORARIO: {
      return {
        ...state,
        passagem: { ...state.passagem, horario: action.payload }
      };
    }
    case CompraPassagemActionType.CHANGE_HORARIO_VOLTA: {
      return {
        ...state,
        passagemVolta: { ...state.passagemVolta, horario: action.payload }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
