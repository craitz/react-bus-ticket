import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
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

const mapPassagemToFirebase = (passagem) => {
  return {
    ...passagem,
    nome: passagem.nome.text,
    cpf: passagem.cpf.text,
    origem: passagem.origem.text,
    destino: passagem.destino.text,
    horario: passagem.horario.text,
    poltrona: passagem.poltrona.value,
    dataCompra: utils.DateNowBr
  };
}

const poltronaToFirebase = (poltrona) => {
  return new Promise((resolve) => {
    const todasPoltronas = globals.getPoltronas();
    const poltronasSelecionadas = poltrona.split(',');
    let poltronasFormatadas = '';

    poltronasSelecionadas.forEach((poltrona, index, arr) => {
      const poltronaCorrente = todasPoltronas[poltrona].label;
      poltronasFormatadas = (index === 0) ? poltronaCorrente : `${poltronasFormatadas} - ${poltronaCorrente}`;

      if (index === (arr.length - 1)) {
        resolve(poltronasFormatadas);
      }
    });
  });
}

export const newPassagem = (passagem) => {
  return (dispatch) => {
    return new Promise((resolve, reject) => {
      const novaPassagem = mapPassagemToFirebase(passagem);
      const { nome, email, cpf, origem, destino, data, horario, dataCompra } = novaPassagem;

      poltronaToFirebase(novaPassagem.poltrona).then((poltronasFormatadas) => {
        novaPassagem.poltrona = poltronasFormatadas;
        const dataFormatted = utils.dateToFirebase(data);
        const horarioFormatted = utils.timeToFirebase(horario);
        const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUser().email);
        const newPassgemRef = `passagens/${emailFirebase}`;
        const poltronasSelecionadas = novaPassagem.poltrona.split(' - ');

        // salva passagem numa lista global
        firebaseHelper.save(novaPassagem, newPassgemRef)
          .then((key) => {
            // altera o estado da passagem
            dispatch({ type: 'NEW_PASSAGEM', payload: { novaPassagem, key } });

            // percorre as poltronas selecionada e salva uma por uma
            poltronasSelecionadas.forEach((val, index, arr) => {
              firebaseHelper.set({ nome, email, cpf, dataCompra },
                `saidas/${origem}/${destino}/${dataFormatted}/${horarioFormatted}/${val}/`)
                .then(() => {
                  if (index === (arr.length - 1)) {
                    resolve({ novaPassagem, key });
                  }
                });
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