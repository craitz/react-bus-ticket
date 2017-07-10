import { CompraPassagemActionType } from './actionTypes'

export const Select = {
  ORIGEM: 0,
  DESTINO: 1,
  POLTRONA: 2,
  HORARIO: 3
}

export const setCidades = (cidades) => {
  return {
    type: CompraPassagemActionType.SET_CIDADES,
    payload: cidades
  };
};

export const setHorarios = (horarios) => {
  return {
    type: CompraPassagemActionType.SET_HORARIOS,
    payload: horarios
  }
};

export const setPoltronas = (poltronas) => {
  return {
    type: CompraPassagemActionType.SET_POLTRONAS,
    payload: poltronas
  }
};

export const resetFormPassagem = () => {
  return { type: CompraPassagemActionType.RESET_FORM_PASSAGEM }
};

export const changeNome = (nome) => {
  return {
    type: CompraPassagemActionType.CHANGE_NOME,
    payload: nome
  }
};

export const setNomeDirty = () => {
  return { type: CompraPassagemActionType.SET_NOME_DIRTY }
};

export const setNomeValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_NOME_VALIDATION,
    payload: { validation, message }
  }
};

export const changeCpf = (cpf) => {
  return {
    type: CompraPassagemActionType.CHANGE_CPF,
    payload: cpf
  }
};

export const setCpfDirty = () => {
  return { type: CompraPassagemActionType.SET_CPF_DIRTY }
};

export const setCpfValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_CPF_VALIDATION,
    payload: { validation, message }
  }
};

export const changeOrigem = (origem) => {
  return {
    type: CompraPassagemActionType.CHANGE_ORIGEM,
    payload: origem
  }
};

export const changeOrigemVolta = (origem) => {
  return {
    type: CompraPassagemActionType.CHANGE_ORIGEM_VOLTA,
    payload: origem
  }
};

export const setOrigemDirty = () => {
  return { type: CompraPassagemActionType.SET_ORIGEM_DIRTY }
};

export const setOrigemValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_ORIGEM_VALIDATION,
    payload: { validation, message }
  }
};

export const changeDestino = (destino) => {
  return {
    type: CompraPassagemActionType.CHANGE_DESTINO,
    payload: destino
  }
};

export const changeDestinoVolta = (destino) => {
  return {
    type: CompraPassagemActionType.CHANGE_DESTINO_VOLTA,
    payload: destino
  }
};

export const setDestinoDirty = () => {
  return { type: CompraPassagemActionType.SET_DESTINO_DIRTY }
};

export const setDestinoValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_DESTINO_VALIDATION,
    payload: { validation, message }
  }
};

export const changePoltrona = (poltrona) => {
  return {
    type: CompraPassagemActionType.CHANGE_POLTRONA,
    payload: poltrona
  }
};

export const changePoltronaVolta = (poltrona) => {
  return {
    type: CompraPassagemActionType.CHANGE_POLTRONA_VOLTA,
    payload: poltrona
  }
};

export const setPoltronaDirty = () => {
  return { type: CompraPassagemActionType.SET_POLTRONA_DIRTY }
};

export const setPoltronaValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_POLTRONA_VALIDATION,
    payload: { validation, message }
  }
};

export const changeData = (data) => {
  return {
    type: CompraPassagemActionType.CHANGE_DATA,
    payload: data
  }
};
export const setDataDirty = () => {
  return { type: CompraPassagemActionType.SET_DATA_DIRTY }
};

export const setDataValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_DATA_VALIDATION,
    payload: { validation, message }
  }
};
export const changeDataVolta = (data) => {
  return {
    type: CompraPassagemActionType.CHANGE_DATA_VOLTA,
    payload: data
  }
};
export const setDataVoltaDirty = () => {
  return { type: CompraPassagemActionType.SET_DATA_VOLTA_DIRTY }
};
export const setDataVoltaValidation = (validation, message) => {
  return {
    type: CompraPassagemActionType.SET_DATA_VOLTA_VALIDATION,
    payload: { validation, message }
  }
};
export const changeHorario = (horario) => {
  return {
    type: CompraPassagemActionType.CHANGE_HORARIO,
    payload: horario
  }
};

export const changeHorarioVolta = (horario) => {
  return {
    type: CompraPassagemActionType.CHANGE_HORARIO_VOLTA,
    payload: horario
  }
};

export const setIdaVolta = (isIdaVolta) => {
  return {
    type: CompraPassagemActionType.SET_IDA_VOLTA,
    payload: isIdaVolta
  }
};

export const backToState = (oldState) => {
  return {
    type: CompraPassagemActionType.BACK_TO_STATE,
    payload: oldState
  }
};

export const SetFrozen = (isFrozen) => {
  return {
    type: CompraPassagemActionType.SET_FROZEN,
    payload: isFrozen
  }
};