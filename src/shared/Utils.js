export const ValidationStatus = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  NONE: null
};

export const SequenceArray = size => [...Array(size).keys()].map(i => ++i);
export const DateNowBr = new Date().toLocaleDateString('pt-BR');
export const DateBr = date => date.toLocaleDateString('pt-BR');
export const dateToFirebase = (text) => text.replace(/\//gi, '');
export const timeToFirebase = (text) => text.replace(/:/gi, '');

const buildIsoDate = (data, hora) => {
  const day = data.slice(0, 2);
  const month = data.slice(3, 5);
  const year = data.slice(6);
  const hour = hora.slice(0, 2);
  const minute = hora.slice(3, 5);

  return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
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
