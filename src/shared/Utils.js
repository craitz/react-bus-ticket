export const ValidationStatus = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  NONE: null
};

export const SavingStatus = {
  SAVING: 'SAVING',
  FEEDBACK: 'FEEDBACK',
  DONE: 'DONE'
};

export const PesquisaPassagensField = {
  NOME: 'nome',
  COMPRA: 'compra',
  LINHA: 'linha',
  SAIDA: 'saida'
}

export const LoginFields = {
  EMAIL: 'email',
  SENHA: 'senha'
}

export const PoltronaStatus = {
  RESERVED: 'reserved',
  SELECTED: 'selected',
  FREE: 'free'
}

export const deepCopy = (array) => {
  return JSON.parse(JSON.stringify(array));
}

export const emailToFirebaseKey = (email) => {
  return email.replace('.', '!%^&*');
};

export const firebaseKeyToEmail = (key) => {
  return key.replace("!%^&*", '.');
};

export const SequenceArray = size => [...Array(size).keys()].map(i => ++i);
export const DateNowBr = new Date().toLocaleDateString('pt-BR');
export const DateBr = date => date.toLocaleDateString('pt-BR');
export const dateToFirebase = (text) => text.replace(/\//gi, '');
export const timeToFirebase = (text) => text.replace(/:/gi, '');

export const buildIsoDate = (data, hora) => {
  const day = data.slice(0, 2);
  const month = data.slice(3, 5);
  const year = data.slice(6);
  const hour = hora.slice(0, 2);
  const minute = hora.slice(3, 5);

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
};

export const objToArray = (obj) => {
  return Object.keys(obj).map((key) => obj[key]);
};

export const buildDateObj = (data, hora) => {
  const iso = buildIsoDate(data, hora);
  return Date.parse(iso);
}

export const validateRequired = (field) => {
  if (field.isPristine) {
    return null;
  } else if (field.text.length > 0) {
    return {
      state: ValidationStatus.SUCCESS,
      text: ''
    }
  } else {
    return {
      state: ValidationStatus.ERROR,
      text: 'Campo obrigatório!'
    }
  }
}
