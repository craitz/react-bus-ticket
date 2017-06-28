const initialState = {
  passagens: [],
  activePage: 1
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PASSAGENS': {
      return {
        ...state,
        passagens: action.payload
      };
    }
    case 'SET_ACTIVE_PAGE': {
      return {
        ...state,
        activePage: action.payload
      };
    }
    default: {
      return state;
    }
  }
};


export default reducer;