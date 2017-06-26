const initialState = {
  passagens: [],
  filtros: {
    compra: '',
    linha: '',
    saida: ''
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PASSAGENS': {
      return {
        ...state,
        passagens: action.payload
      };
    }
    case 'SET_FILTRO_COMPRA': {
      return {
        ...state,
        filtros: {
          ...state.filtros,
          compra: action.payload
        }
      };
    }
    case 'SET_FILTRO_LINHA': {
      return {
        ...state,
        filtros: {
          ...state.filtros,
          linha: action.payload
        }
      };
    }
    case 'SET_FILTRO_SAIDA': {
      return {
        ...state,
        filtros: {
          ...state.filtros,
          saida: action.payload
        }
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;