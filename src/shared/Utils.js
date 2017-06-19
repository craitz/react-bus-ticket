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
