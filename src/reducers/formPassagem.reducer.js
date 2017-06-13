import { DateNowBr } from '../shared/Utils'

const reducer = (state = {
  redirectTo: false,
  passagem: {
    nome: {
      text: '',
      isPristine: true
    },
    email: {
      text: '',
      isPristine: true
    },
    origem: {
      val: 0,
      text: 'null',
    },
    destino: {
      val: 1,
      text: 'null',
    },
    poltrona: {
      val: 0,
      text: 'null',
    },
    data: DateNowBr,
    horario: {
      val: 0,
      text: 'null',
    }
  }
}, action) => {
  switch (action.type) {
    case 'CHANGE_NOME': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          nome: {
            text: action.payload,
            isPristine: false
          }
        }
      };
    }
    case 'CHANGE_EMAIL': {
      return {
        ...state,
        passagem: {
          ...state.passagem,
          email: {
            text: action.payload,
            isPristine: false
          }
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
        passagem: { ...state.passagem, poltrona: action.payload }
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
    case 'CHANGE_REDIRECT_TO': {
      return { ...state, redirectTo: action.payload };
    }
    default: {
      return state;
    }
  }
}

export default reducer;