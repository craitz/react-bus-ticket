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
    case 'FETCHING_CIDADES': {
      return { ...state, fetching: true };
    }
    case 'FETCHING_CIDADES_REJECTED': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCHING_CIDADES_FULFILLED': {
      return { ...state, fetching: false, fetched: true, cidades: action.payload };
    }
    case 'FETCHING_HORARIOS': {
      return { ...state, fetching: true };
    }
    case 'FETCHING_HORARIOS_REJECTED': {
      return { ...state, fetching: false, error: action.payload };
    }
    case 'FETCHING_HORARIOS_FULFILLED': {
      return { ...state, fetching: false, fetched: true, horarios: action.payload };
    }
    case 'FETCH_POLTRONAS': {
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