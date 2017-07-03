import { PesquisaPassagensActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  passagens: [],
  consulta: {
    sort: {
      field: '',
      direction: true
    },
    filter: {
      nome: '',
      compra: '',
      linha: '',
      saida: '',
      poltrona: ''
    },
    activePage: 1,
    page: []
  }
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case PesquisaPassagensActionType.SET_PASSAGENS: {
      return {
        ...state,
        passagens: action.payload
      };
    }
    case PesquisaPassagensActionType.RESET_CONSULTA: {
      return {
        ...state,
        consulta: { ...initialState.consulta }
      };
    }
    case PesquisaPassagensActionType.SET_ACTIVE_PAGE: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          activePage: action.payload
        }
      };
    }
    case PesquisaPassagensActionType.SET_PAGE: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          page: action.payload
        }
      };
    }
    case PesquisaPassagensActionType.SET_SORT_FIELD: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          sort: {
            ...state.consulta.sort,
            field: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_SORT_DIRECTION: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          sort: {
            ...state.consulta.sort,
            direction: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_FILTER_NOME: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          filter: {
            ...state.consulta.filter,
            nome: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_FILTER_COMPRA: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          filter: {
            ...state.consulta.filter,
            compra: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_FILTER_LINHA: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          filter: {
            ...state.consulta.filter,
            linha: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_FILTER_SAIDA: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          filter: {
            ...state.consulta.filter,
            saida: action.payload
          }
        }
      };
    }
    case PesquisaPassagensActionType.SET_FILTER_POLTRONA: {
      return {
        ...state,
        consulta: {
          ...state.consulta,
          filter: {
            ...state.consulta.filter,
            poltrona: action.payload
          }
        }
      };
    }
    default: {
      return state;
    }
  }
};


export default reducer;