import { SnackbarActionType } from './actionTypes'

export const setVisible = (isVisible) => {
  return {
    type: SnackbarActionType.SET_VISIBLE,
    payload: isVisible
  }
};

export const setMessage = (message) => {
  return {
    type: SnackbarActionType.SET_MESSAGE,
    payload: message
  }
};

export const setType = (type) => {
  return {
    type: SnackbarActionType.SET_TYPE,
    payload: type
  }
};

export const show = (type, message) => {
  return {
    type: SnackbarActionType.SHOW,
    payload: { type, message }
  };
};

