export const changeNome = (nome) => {
  return {
    type: 'CHANGE_NOME',
    payload: nome
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