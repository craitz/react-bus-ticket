import { PesquisaPassagensActionType } from './actionTypes'

export const setPassagens = (passagens) => {
  return {
    type: PesquisaPassagensActionType.SET_PASSAGENS,
    payload: passagens
  }
};

export const resetConsulta = () => {
  return {
    type: PesquisaPassagensActionType.RESET_CONSULTA,
  }
};

export const setActivePage = (pageNumber) => {
  return {
    type: PesquisaPassagensActionType.SET_ACTIVE_PAGE,
    payload: pageNumber
  }
};

export const setActivePageThunk = (pageNumber) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setActivePage(pageNumber));
      resolve();
    });
  };
};

export const resetConsultaThunk = () => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(resetConsulta());
      resolve();
    });
  };
};

export const setPage = (page) => {
  return {
    type: PesquisaPassagensActionType.SET_PAGE,
    payload: page
  }
};

export const setSortField = (field) => {
  return {
    type: PesquisaPassagensActionType.SET_SORT_FIELD,
    payload: field
  }
};

export const setSortFieldThunk = (field) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setSortField(field));
      resolve();
    });
  };
};

export const setSortDirection = (direction) => {
  return {
    type: PesquisaPassagensActionType.SET_SORT_DIRECTION,
    payload: direction
  }
};

export const setSortDirectionThunk = (direction) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setSortDirection(direction));
      resolve();
    });
  };
};

export const setSortThunk = (field, direction) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setSortField(field));
      dispatch(setSortDirection(direction));
      resolve();
    });
  };
};

export const setFilterNome = (filter) => {
  return {
    type: PesquisaPassagensActionType.SET_FILTER_NOME,
    payload: filter
  }
};

export const setFilterNomeThunk = (filter) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setFilterNome(filter));
      resolve();
    });
  };
};

export const setFilterCompra = (filter) => {
  return {
    type: PesquisaPassagensActionType.SET_FILTER_COMPRA,
    payload: filter
  }
};

export const setFilterCompraThunk = (filter) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setFilterCompra(filter));
      resolve();
    });
  };
};

export const setFilterLinha = (filter) => {
  return {
    type: PesquisaPassagensActionType.SET_FILTER_LINHA,
    payload: filter
  }
};

export const setFilterLinhaThunk = (filter) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setFilterLinha(filter));
      resolve();
    });
  };
};

export const setFilterSaida = (filter) => {
  return {
    type: PesquisaPassagensActionType.SET_FILTER_SAIDA,
    payload: filter
  }
};

export const setFilterSaidaThunk = (filter) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setFilterSaida(filter));
      resolve();
    });
  };
};

export const setFilterPoltrona = (filter) => {
  return {
    type: PesquisaPassagensActionType.SET_FILTER_POLTRONA,
    payload: filter
  }
};

export const setFilterPoltronaThunk = (filter) => {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      dispatch(setFilterPoltrona(filter));
      resolve();
    });
  };
};

