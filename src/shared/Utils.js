import React from 'react';
import * as moment from 'moment';

export const SnackbarTypes = {
  SUCCESS: 'snackbar success',
  WARNING: 'snackbar warning',
  ERROR: 'snackbar error'
};

export const BusStatus = {
  VAZIO: 'VAZIO',
  OCUPADO: 'OCUPADO',
  CHEIO: 'CHEIO'
};

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
  COMPRA: 'COMPRA',
  LINHA: 'linha',
  SAIDA: 'saida',
  ORIGEM: 'ORIGEM',
  DESTINO: 'DESTINO',
  DATA: 'DATA',
  HORARIO: 'HORARIO'
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

export const dateToFirebase = (text) => {
  const momentDate = moment(text, 'DD/MM/YYYY');
  return momentDate.format('YYYYMMDD');
}

export const brStringToDate = (text) => {
  const _moment = moment(text, 'DD/MM/YYYY');
  return new Date(_moment.toISOString());
}

export const formatDate = (value) => {
  const dia = value.getDate().toString().padStart(2, '0');
  const mes = (value.getMonth() + 1).toString().padStart(2, '0');
  const ano = value.getFullYear();
  return `${dia}/${mes}/${ano}`;
}


export const isObject = obj => (obj === Object(obj));

export const timeToFirebase = (text) => text.replace(/:/gi, '');

export const firebaseToTime = (text) => {
  const momentTime = moment(text, 'HHmm');
  return momentTime.format('HH:mm');
}

export const firebaseToTimeExt = (text) => {
  const hora = text.slice(0, 2);
  const min = text.slice(2);
  return `${hora}h ${min}m`;
}

export const firebaseToTimeElement = (text) => {
  const hora = text.slice(0, 2);
  const min = text.slice(2);
  return (
    <div className="text-horario text-left">
      <span>{hora}</span>
      <small>h</small>
      <span>{min}</span>
      <small>m</small>
    </div >
  );
}

export const checkHorario = (data, horario) => {
  const strNow = moment().format('YYYYMMDDHHmm');
  const strData = `${data}${horario}`;
  return (strData > strNow);
}

export const buildIsoDateTime = (data, hora) => {
  const day = data.slice(0, 2);
  const month = data.slice(3, 5);
  const year = data.slice(6);
  const hour = hora.slice(0, 2);
  const minute = hora.slice(3, 5);

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
};

export const buildIsoDate = (data) => {
  const day = data.slice(0, 2);
  const month = data.slice(3, 5);
  const year = data.slice(6);

  return `${year}-${month}-${day}T00:00:00.000Z`;
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

export const sortPoltronas = (poltronas) => {
  const poltronasTemp = deepCopy(poltronas);
  poltronasTemp.sort();
  return poltronasTemp.join(' | ');
}


