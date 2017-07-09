import { ModalTrajetoActionType } from './actionTypes'

export const setVisible = (isVisible) => {
  return {
    type: ModalTrajetoActionType.SET_VISIBLE,
    payload: isVisible
  }
};