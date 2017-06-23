import { firebaseHelper } from '../shared/FirebaseHelper';
import { dateToFirebase, timeToFirebase } from '../shared/Utils';
import { globals } from '../shared/Globals';

export const Select = {
  ORIGEM: 0,
  DESTINO: 1,
  POLTRONA: 2,
  HORARIO: 3
}

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

export const resetFormPassagem = () => {
  return {
    type: 'RESET_FORM_PASSAGEM'
  }
};

export const changeNome = (nome) => {
  return {
    type: 'CHANGE_NOME',
    payload: nome
  }
};

export const setNomePristine = () => {
  return { type: 'SET_NOME_PRISTINE' }
};

export const setNomeDirty = () => {
  return { type: 'SET_NOME_DIRTY' }
};

export const setNomeValidation = (validation, message) => {
  return {
    type: 'SET_NOME_VALIDATION',
    payload: { validation, message }
  }
};

export const changeCpf = (cpf) => {
  return {
    type: 'CHANGE_CPF',
    payload: cpf
  }
};

export const setCpfPristine = () => {
  return { type: 'SET_CPF_PRISTINE' }
};

export const setCpfDirty = () => {
  return { type: 'SET_CPF_DIRTY' }
};

export const setCpfValidation = (validation, message) => {
  return {
    type: 'SET_CPF_VALIDATION',
    payload: { validation, message }
  }
};


export const changeEmail = (email) => {
  return {
    type: 'CHANGE_EMAIL',
    payload: email
  }
};

export const changeOrigem = (origem) => {
  return {
    type: 'CHANGE_ORIGEM',
    payload: origem
  }
};

export const changeDestino = (destino) => {
  return {
    type: 'CHANGE_DESTINO',
    payload: destino
  }
};

export const changePoltrona = (poltrona) => {
  return {
    type: 'CHANGE_POLTRONA',
    payload: poltrona
  }
};

export const setPoltronaPristine = () => {
  return { type: 'SET_POLTRONA_PRISTINE' }
};

export const setPoltronaDirty = () => {
  return { type: 'SET_POLTRONA_DIRTY' }
};

export const setPoltronaValidation = (validation, message) => {
  return {
    type: 'SET_POLTRONA_VALIDATION',
    payload: { validation, message }
  }
};

export const changeData = (data) => {
  return {
    type: 'CHANGE_DATA',
    payload: data
  }
};

export const changeHorario = (horario) => {
  return {
    type: 'CHANGE_HORARIO',
    payload: horario
  }
};