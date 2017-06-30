import { PesquisaPassagensActionType } from '../reducers/actionTypes'

export const setPassagens = (passagens) => {
  return {
    type: PesquisaPassagensActionType.SET_PASSAGENS,
    payload: passagens
  }
};


