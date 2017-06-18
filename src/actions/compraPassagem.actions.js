import { firebaseHelper } from '../shared/FirebaseHelper';
import { SequenceArray } from '../shared/Utils.js';

export const fetchCidades = () => {
  return (dispatch) => {
    firebaseHelper.fetch('cidades/')
      .then((cidades) => {
        cidades.sort();
        dispatch({ type: 'FETCHING_CIDADES_FULFILLED', payload: cidades });
      });
  }
};

export const fetchHorarios = () => {
  return (dispatch) => {
    firebaseHelper.fetch('horarios/')
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
    firebaseHelper.fetch('passagens/')
      .then((passagens) => {
        dispatch({ type: 'FETCHING_PASSAGENS_FULFILLED', payload: (passagens || {}) });
      })
  }
};

export const newPassagem = (passagem) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebaseHelper.save(passagem, 'passagens/')
        .then((key) => {
          dispatch({ type: 'NEW_PASSAGEM', payload: { passagem, key } });
          resolve(key);
        })
    });
  }
};
