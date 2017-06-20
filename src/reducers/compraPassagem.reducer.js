const reducer = (state = {
  cidades: [],
  horarios: [],
  poltronas: [],
  passagens: {},
  fetching: false,
  fetched: false,
  error: null,
}, action) => {
  switch (action.type) {
    case 'SET_CIDADES': {
      return { ...state, cidades: action.payload };
    }
    case 'SET_HORARIOS': {
      return { ...state, horarios: action.payload };
    }
    case 'SET_POLTRONAS': {
      return { ...state, poltronas: action.payload };
    }
    case 'FETCHING_PASSAGENS': {
      return { ...state, fetching: true };
    }
    case 'FETCHING_PASSAGENS_REJECTED': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCHING_PASSAGENS_FULFILLED': {
      return { ...state, fetching: false, fetched: true, passagens: action.payload };
    }
    case 'NEW_PASSAGEM': {
      return {
        ...state,
        passagens: { ...state.passagens, [action.payload.key]: action.payload.passagem }
      };
    }
    default: {
      return state;
    }
  }
}

export default reducer;