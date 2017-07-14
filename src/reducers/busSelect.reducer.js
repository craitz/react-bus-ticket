import Immutable from 'seamless-immutable';
import { PoltronaStatus } from '../shared/Utils';
import { BusSelectActionType } from '../actions/actionTypes';

const initialState = Immutable({
  poltronas: Array(44).keys().map((item) => {
    return {
      value: (++item).toString().padStart(2, '0'),
      status: PoltronaStatus.FREE
    };
  })
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case BusSelectActionType.SET_POLTRONAS: {
      return {
        ...state,
        poltronas: action.payload
      }
    }
    case BusSelectActionType.SET_POLTRONA_STATUS: {
      return {
        ...state,
        poltronas: [
          ...state.poltronas,
          [action.payload.index] = {
            ...[action.payload.index],
            status: action.payload.status
          }
        ]
      }
    }
    default: {
      return state;
    }
  }
};

export default reducer;