import { ModalTrajetoActionType } from './actionTypes'

export const setVisible = (isVisible, isFromWelcome = false, snapshot = null) => {
  return {
    type: ModalTrajetoActionType.SET_VISIBLE,
    payload: { isVisible, isFromWelcome, snapshot }
  }
};