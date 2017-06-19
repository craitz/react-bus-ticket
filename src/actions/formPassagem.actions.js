export const Select = {
  ORIGEM: 0,
  DESTINO: 1,
  POLTRONA: 2,
  HORARIO: 3
}

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