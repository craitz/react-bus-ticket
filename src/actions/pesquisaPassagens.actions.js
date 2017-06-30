import { PesquisaPassagensActionType } from './actionTypes'

export const setPassagens = (passagens) => {
  return {
    type: PesquisaPassagensActionType.SET_PASSAGENS,
    payload: passagens
  }
};


