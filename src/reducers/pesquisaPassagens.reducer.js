const initialState = {
  passagens: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PASSAGENS': {
      return {
        ...state,
        passagens: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;