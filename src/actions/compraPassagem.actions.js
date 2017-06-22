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
    poltrona: passagem.poltrona.value,
    horario: passagem.horario.text
  };
}

export const newPassagem = (passagem) => {
  const todasPoltronas = globals.getPoltronas();
  const novaPassagem = mapPassagemToFirebase(passagem);
  const { nome, email, origem, destino, poltrona, data, horario } = novaPassagem;
  const dataFormatted = dateToFirebase(data);
  const horarioFormatted = timeToFirebase(horario);
  const poltronasSelecionadas = poltrona.split(',');


  return (dispatch) => {
    return new Promise((resolve, reject) => {
      // salva passagem numa lista global
      firebaseHelper.save(novaPassagem, 'passagens/')
        .then((key) => {
          // altera o estado da passagem
          dispatch({ type: 'NEW_PASSAGEM', payload: { novaPassagem, key } });

          // percorre as poltronas selecionada e salva uma por uma
          poltronasSelecionadas.forEach((val, index, arr) => {
            // obtém o label da poltrona corrent
            const poltronaCorrente = todasPoltronas[val].label;

            // salva no banco de dados
            firebaseHelper.set({ nome, email },
              `saidas/${origem}/${destino}/${dataFormatted}/${horarioFormatted}/${poltronaCorrente}/`)
              .then(() => {
                // só resolve quando atingir a última poltrona
                if (index === (arr.length - 1)) {
                  resolve(key);
                }
              });
          });
        });
    });
  };
};
