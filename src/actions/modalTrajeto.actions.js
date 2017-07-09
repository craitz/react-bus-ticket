import { ModalTrajetoActionType } from './actionTypes'

export const setVisible = (isVisible, isFromWelcome) => {
  return {
    type: ModalTrajetoActionType.SET_VISIBLE,
    payload: { isVisible, isFromWelcome }
  }
};