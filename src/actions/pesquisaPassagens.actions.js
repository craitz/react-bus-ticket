export const setPassagens = (passagens) => {
  return {
    type: 'SET_PASSAGENS',
    payload: passagens
  }
};

export const setFiltroCompra = (filtro) => {
  return {
    type: 'SET_FILTRO_COMPRA',
    payload: filtro
  }
};

export const setFiltroLinha = (filtro) => {
  return {
    type: 'SET_FILTRO_LINHA',
    payload: filtro
  }
};

export const setFiltroSaida = (filtro) => {
  return {
    type: 'SET_FILTRO_SAIDA',
    payload: filtro
  }
};