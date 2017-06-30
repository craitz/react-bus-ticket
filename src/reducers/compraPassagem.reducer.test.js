import reducer from './compraPassagem.reducer';
import Immutable from 'seamless-immutable';
import { DateNowBr, ValidationStatus } from '../shared/Utils'

const initialState = Immutable({
  cidades: [],
  horarios: [],
  poltronas: [],
  fetching: false,
  fetched: false,
  error: null,
  passagem: {
    nome: {
      text: '',
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    },
    cpf: {
      text: '',
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    },
    email: '',
    origem: {
      val: 0,
      text: '',
    },
    destino: {
      val: 1,
      text: '',
    },
    poltrona: {
      value: [],
      isPristine: true,
      validation: ValidationStatus.NONE,
      message: ''
    },
    data: DateNowBr,
    horario: {
      val: 0,
      text: '',
    },
    dataCompra: DateNowBr
  }
});

const merge = (obj) => {
  return initialState.merge(obj, { deep: true });
}

const setCidadesAfterState = merge({
  cidades: [1, 2, 3]
});

const setHorariosAfterState = merge({
  horarios: [4, 5, 6]
});

const setPoltronasAfterState = merge({
  poltronas: [7, 8, 9]
});

describe('pesquisaPassagens reducer', () => {
  it('deve ter estado inicial', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('não deve alterar estado', () => {
    expect(reducer(initialState, { type: 'ACTION_INVALIDO' }))
      .toEqual(initialState);
  });

  it('deve mudar as cidades', () => {
    expect(reducer(initialState, {
      type: 'SET_CIDADES',
      payload: [1, 2, 3]
    })).toEqual(setCidadesAfterState);
  });

  it('deve mudar os horarios', () => {
    expect(reducer(initialState, {
      type: 'SET_HORARIOS',
      payload: [4, 5, 6]
    })).toEqual(setHorariosAfterState);
  });

  it('deve mudar as poltronas', () => {
    expect(reducer(initialState, {
      type: 'SET_POLTRONAS',
      payload: [7, 8, 9]
    })).toEqual(setPoltronasAfterState);
  });
});