import reducer from './pesquisaPassagens.reducer';
import { PesquisaPassagensActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  passagens: []
});

const merge = (obj) => {
  return initialState.merge(obj, { deep: true });
}

const changePassagemAfterState = merge({
  passagens: [1, 2, 3, 4, 5]
});

describe('pesquisaPassagens reducer', () => {
  it('deve ter estado inicial', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('não deve alterar estado', () => {
    expect(reducer(initialState, { type: 'ACTION_INVALIDO' }))
      .toEqual(initialState);
  });

  it('deve mudar as passagens', () => {
    expect(reducer(initialState, {
      type: PesquisaPassagensActionType.SET_PASSAGENS,
      payload: [1, 2, 3, 4, 5]
    })).toEqual(changePassagemAfterState);
  });
});