import { firebaseHelper } from '../shared/FirebaseHelper';
import { dateToFirebase, timeToFirebase } from '../shared/Utils';
import { globals } from '../shared/Globals';

export const setCidades = (cidades) => {
  return {
    type: 'SET_CIDADES',
    payload: cidades
  };
};

export const setHorarios = (horarios) => {
  return {
    type: 'SET_HORARIOS',
    payload: horarios
  }
};

export const setPoltronas = (poltronas) => {
  return {
    type: 'SET_POLTRONAS',
    payload: poltronas
  }
};

export const fetchPassagens = () => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebaseHelper.fetch('passagens/')
        .then((passagens) => {
          dispatch({ type: 'FETCHING_PASSAGENS_FULFILLED', payload: (passagens || {}) });
          resolve(passagens);
        });
    });
  }
};

const mapPassagemToFirebase = (passagem) => {
  return {
    ...passagem,
    nome: passagem.nome.text,
    origem: passagem.origem.text,
    destino: passagem.destino.text,
    poltrona: globals.poltronas[passagem.poltrona.value].label,
    horario: passagem.horario.text
  };
}

export const newPassagem = (passagem) => {
  const novaPassagem = mapPassagemToFirebase(passagem);
  const { nome, email, origem, destino, poltrona, data, horario } = novaPassagem;
  const dataFormatted = dateToFirebase(data);
  const horarioFormatted = timeToFirebase(horario);
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      firebaseHelper.save(novaPassagem, 'passagens/')
        .then((key) => {
          dispatch({ type: 'NEW_PASSAGEM', payload: { novaPassagem, key } });
          firebaseHelper.set({ nome, email },
            `saidas/${origem}/${destino}/${dataFormatted}/${horarioFormatted}/${poltrona}/`)
            .then(() => {
              resolve(key);
            });
        })
    });
  }
};
