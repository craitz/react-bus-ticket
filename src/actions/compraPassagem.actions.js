import { fetch, save } from '../shared/FirebaseHelper';
import { SequenceArray } from '../shared/Utils.js';

export const fetchCidades = () => {
  return (dispatch) => {
    fetch('cidades/')
      .then((cidades) => {
        dispatch({ type: 'FETCHING_CIDADES_FULFILLED', payload: cidades });
      });
  }
};

export const fetchHorarios = () => {
  return (dispatch) => {
    fetch('horarios/')
      .then((horarios) => {
        dispatch({ type: 'FETCHING_HORARIOS_FULFILLED', payload: horarios });
      })
  }
};

export const fetchPoltronas = () => {
  return {
    type: 'FETCH_POLTRONAS',
    payload: SequenceArray(42)
  }
};

export const fetchPassagens = () => {
  return (dispatch) => {
    fetch('passagens/')
      .then((passagens) => {
        dispatch({ type: 'FETCHING_PASSAGENS_FULFILLED', payload: (passagens || {}) });
      })
  }
};

export const newPassagem = (passagem) => {
  return (dispatch) => {
    save(passagem, 'passagens/')
      .then((key) => {
        dispatch({ type: 'NEW_PASSAGEM', payload: { passagem, key } });
      })
  }
};
