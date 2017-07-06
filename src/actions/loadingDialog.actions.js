import { LoadingDialogActionType } from './actionTypes'

export const setStatus = (status) => {
  return {
    type: LoadingDialogActionType.SET_STATUS,
    payload: status
  }
};

export const setLoadingMessage = (message) => {
  return {
    type: LoadingDialogActionType.SET_LOADING_MESSAGE,
    payload: message
  }
};

export const setLoadingIcon = (icon) => {
  return {
    type: LoadingDialogActionType.SET_LOADING_ICON,
    payload: icon
  }
};

export const setDoneMessage = (message) => {
  return {
    type: LoadingDialogActionType.SET_DONE_MESSAGE,
    payload: message
  }
};

export const setDoneIcon = (icon) => {
  return {
    type: LoadingDialogActionType.SET_DONE_ICON,
    payload: icon
  }
};