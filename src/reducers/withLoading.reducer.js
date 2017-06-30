import Immutable from 'seamless-immutable';

const initialState = Immutable({
  isLoading: false
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      }
    }
    default: {
      return state;
    }
  }
}

export default reducer;