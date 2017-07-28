import Immutable from 'seamless-immutable';
import { SnackbarActionType } from '../actions/actionTypes';
import * as utils from '../shared/Utils'

const initialState = Immutable({
  visible: false,
  message: '',
  type: utils.SnackbarTypes.SUCCESS
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SnackbarActionType.SET_VISIBLE: {
      return {
        ...state,
        visible: action.payload
      }
    }
    case SnackbarActionType.SET_MESSAGE: {
      return {
        ...state,
        message: action.payload
      }
    }
    case SnackbarActionType.SET_TYPE: {
      return {
        ...state,
        type: action.payload
      }
    }
    case SnackbarActionType.SHOW: {
      return {
        ...state,
        type: action.payload.type,
        message: action.payload.message,
        visible: true
      }
    }
    default: {
      return state;
    }
  }
};


export default reducer;
