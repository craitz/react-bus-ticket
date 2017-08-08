import { PerfilUsuarioActionType } from './actionTypes'

export const changeNome = (nome) => {
  return {
    type: PerfilUsuarioActionType.CHANGE_NOME,
    payload: nome
  }
};

export const setNomeDirty = () => {
  return { type: PerfilUsuarioActionType.SET_NOME_DIRTY }
};

export const setNomeValidation = (validation, message) => {
  return {
    type: PerfilUsuarioActionType.SET_NOME_VALIDATION,
    payload: { validation, message }
  }
};

export const changeCpf = (cpf) => {
  return {
    type: PerfilUsuarioActionType.CHANGE_CPF,
    payload: cpf
  }
};

export const setCpfDirty = () => {
  return { type: PerfilUsuarioActionType.SET_CPF_DIRTY }
};

export const setCpfValidation = (validation, message) => {
  return {
    type: PerfilUsuarioActionType.SET_CPF_VALIDATION,
    payload: { validation, message }
  }
};

export const changeTelefone = (telefone) => {
  return {
    type: PerfilUsuarioActionType.CHANGE_TELEFONE,
    payload: telefone
  }
};

export const setTelefoneDirty = () => {
  return { type: PerfilUsuarioActionType.SET_TELEFONE_DIRTY }
};

export const setTelefoneValidation = (validation, message) => {
  return {
    type: PerfilUsuarioActionType.SET_TELEFONE_VALIDATION,
    payload: { validation, message }
  }
};

export const changeCelular = (celular) => {
  return {
    type: PerfilUsuarioActionType.CHANGE_CELULAR,
    payload: celular
  }
};

export const setCelularDirty = () => {
  return { type: PerfilUsuarioActionType.SET_CELULAR_DIRTY }
};

export const setCelularValidation = (validation, message) => {
  return {
    type: PerfilUsuarioActionType.SET_CELULAR_VALIDATION,
    payload: { validation, message }
  }
};

export const changeDataNascimento = (data) => {
  return {
    type: PerfilUsuarioActionType.CHANGE_DATANASC,
    payload: data
  }
};

export const setDataNascimentoDirty = () => {
  return { type: PerfilUsuarioActionType.SET_DATANASC_DIRTY }
};

export const setDataNascimentoValidation = (validation, message) => {
  return {
    type: PerfilUsuarioActionType.SET_DATANASC_VALIDATION,
    payload: { validation, message }
  }
};

export const resetPerfil = () => {
  return { type: PerfilUsuarioActionType.RESET_PERFIL }
};

export const setSaving = (savingStatus) => {
  return {
    type: PerfilUsuarioActionType.SET_SAVING,
    payload: savingStatus
  }
};

export const setEdicaoHabilitada = (isEdicaoHabilitada) => {
  return {
    type: PerfilUsuarioActionType.SET_EDICAO_HABILITADA,
    payload: isEdicaoHabilitada
  }
};
