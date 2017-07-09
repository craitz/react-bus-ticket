import { ModalTrajetoActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  isVisible: false,
  isFromWelcome: false
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ModalTrajetoActionType.SET_VISIBLE: {
      return {
        ...state,
        isVisible: action.payload.isVisible,
        isFromWelcome: action.payload.isFromWelcome,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;