import { PesquisaPassagensActionType } from '../actions/actionTypes'
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  passagens: []
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case PesquisaPassagensActionType.SET_PASSAGENS: {
      return {
        ...state,
        passagens: action.payload
      };
    }
    default: {
      return state;
    }
  }
};


export default reducer;