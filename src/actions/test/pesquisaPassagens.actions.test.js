import * as actions from './pesquisaPassagens.actions';
import { PesquisaPassagensActionType } from './actionTypes'

describe('pesquisaPassagens actions', () => {
  it('deve setar as passagens', () => {
    expect(actions.setPassagens([1, 2, 3])).toEqual({
      type: PesquisaPassagensActionType.SET_PASSAGENS,
      payload: [1, 2, 3]
    });
  });
});