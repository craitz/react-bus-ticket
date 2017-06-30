import reducer from './withLoading.reducer';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  isLoading: false
});

const merge = (obj) => {
  return initialState.merge(obj, { deep: true });
}

const changeLoadingAfterState = merge({
  isLoading: true
});

describe('withLoading reducer', () => {
  it('deve ter estado inicial', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('não deve alterar estado', () => {
    expect(reducer(initialState, { type: 'ACTION_INVALIDO' }))
      .toEqual(initialState);
  });

  it('deve mudar o loading', () => {
    expect(reducer(initialState, {
      type: 'SET_LOADING',
      payload: true
    })).toEqual(changeLoadingAfterState);
  });
});