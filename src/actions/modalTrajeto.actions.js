import { ModalTrajetoActionType } from './actionTypes'

export const setVisible = (isVisible, isFromWelcome = false, backupState = null) => {
  return {
    type: ModalTrajetoActionType.SET_VISIBLE,
    payload: { isVisible, isFromWelcome, backupState }
  }
};