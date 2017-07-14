import { BusSelectActionType } from './actionTypes'

export const setPoltronas = (poltronas) => {
  return {
    type: BusSelectActionType.SET_POLTRONAS,
    payload: poltronas
  };
};

export const setPoltronaStatus = (index, status) => {
  return {
    type: BusSelectActionType.SET_POLTRONA_STATUS,
    payload: { index, status }
  };
};
