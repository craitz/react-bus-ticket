export const SequenceArray = size => [...Array(size).keys()].map(i => ++i);

export const DateNowBr = new Date().toLocaleDateString('pt-BR');

export const DateBr = date => date.toLocaleDateString('pt-BR');

export const validateRequired = (field) => {
  if (field.isPristine) {
    return null;
  } else if (field.text.length > 0) {
    return {
      state: 'success',
      text: ''
    }
  } else {
    return {
      state: 'error',
      text: 'Campo obrigatório!'
    }
  }
}
