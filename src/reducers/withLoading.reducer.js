import Immutable from 'seamless-immutable';
import { withLoadingActionType } from '../actions/actionTypes'

const initialState = Immutable({
  isLoading: false
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case withLoadingActionType.SET_LOADING: {
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