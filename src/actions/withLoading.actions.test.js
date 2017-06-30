import * as actions from './withLoading.actions';
import { withLoadingActionType } from '../reducers/actionTypes'

describe('withLoading actions', () => {
  it('deve setar o loading', () => {
    expect(actions.setLoading(true)).toEqual({
      type: withLoadingActionType.SET_LOADING,
      payload: true
    });
  });
});