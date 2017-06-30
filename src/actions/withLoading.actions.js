import { withLoadingActionType } from '../reducers/actionTypes'

export const setLoading = (isLoading) => {
  return {
    type: withLoadingActionType.SET_LOADING,
    payload: isLoading
  }
};