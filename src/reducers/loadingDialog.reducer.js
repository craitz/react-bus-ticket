import Immutable from 'seamless-immutable';
import { SavingStatus } from '../shared/Utils';
import { LoadingDialogActionType } from '../actions/actionTypes';

const initialState = Immutable({
  status: SavingStatus.DONE,
  loadingMessage: '',
  loadingIcon: '',
  doneMessage: '',
  doneIcon: ''
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case LoadingDialogActionType.SET_STATUS: {
      return {
        ...state,
        status: action.payload
      }
    }
    case LoadingDialogActionType.SET_DONE_ICON: {
      return {
        ...state,
        doneIcon: action.payload
      }
    }
    case LoadingDialogActionType.SET_DONE_MESSAGE: {
      return {
        ...state,
        doneMessage: action.payload
      }
    }
    case LoadingDialogActionType.SET_LOADING_ICON: {
      return {
        ...state,
        loadingIcon: action.payload
      }
    }
    case LoadingDialogActionType.SET_LOADING_MESSAGE: {
      return {
        ...state,
        loadingMessage: action.payload
      }
    }
    default: {
      return state;
    }
  }
};

export default reducer;