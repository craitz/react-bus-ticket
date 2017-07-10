import { ModalTrajetoActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

export const initialState = Immutable({
  isVisible: false,
  isFromWelcome: false,
  backupState: null
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ModalTrajetoActionType.SET_VISIBLE: {
      return {
        ...state,
        isVisible: action.payload.isVisible,
        isFromWelcome: action.payload.isFromWelcome,
        backupState: action.payload.backupState,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;