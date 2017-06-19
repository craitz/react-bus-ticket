import { firebaseHelper } from '../shared/FirebaseHelper';
import { dateToFirebase, timeToFirebase } from '../shared/Utils';

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

export const setPoltronas = (poltronas) => {
  return {
    type: 'SET_POLTRONAS',
    payload: poltronas
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

const mapPassagemToFirebase = (passagem) => {
  return {
    ...passagem,
    nome: passagem.nome.text,
    origem: passagem.origem.text,
    destino: passagem.destino.text,
    poltrona: passagem.poltrona.text,
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
