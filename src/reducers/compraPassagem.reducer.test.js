import reducer from './compraPassagem.reducer';
import Immutable from 'seamless-immutable';
import { DateNowBr, ValidationStatus } from '../shared/Utils'
import { CompraPassagemActionType } from './actionTypes'

const initialState = Immutable({
  cidades: [],
  horarios: [],
  poltronas: [],
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
    origem: {
      val: 0,
      text: '',
    },
    destino: {
      val: 1,
      text: '',
    },
    poltrona: {
      value: '',
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

const resetFormPassagemAfterState = merge({
  cidades: []
});

const changeNomeAfterState = merge({
  passagem: {
    nome: {
      text: 'nome teste'
    }
  }
});

const setNomeDirtyAfterState = merge({
  passagem: {
    nome: {
      isPristine: false
    }
  }
});

const setNomeValidationAfterState = merge({
  passagem: {
    nome: {
      validation: ValidationStatus.ERROR,
      message: 'mensagem nome teste'
    }
  }
});

const changeCpfAfterState = merge({
  passagem: {
    cpf: {
      text: 'cpf teste'
    }
  }
});

const setCpfDirtyAfterState = merge({
  passagem: {
    cpf: {
      isPristine: false
    }
  }
});

const setCpfValidationAfterState = merge({
  passagem: {
    cpf: {
      validation: ValidationStatus.ERROR,
      message: 'mensagem cpf teste'
    }
  }
});

const changeOrigemAfterState = merge({
  passagem: {
    origem: {
      val: 0,
      text: 'cidade origem teste'
    }
  }
});

const changeDestinoAfterState = merge({
  passagem: {
    destino: {
      val: 0,
      text: 'cidade destino teste'
    }
  }
});

const changePoltronaAfterState = merge({
  passagem: {
    poltrona: {
      value: '1,2,3'
    }
  }
});

const setPoltronaDirtyAfterState = merge({
  passagem: {
    poltrona: {
      isPristine: false
    }
  }
});

const setPoltronaValidationAfterState = merge({
  passagem: {
    poltrona: {
      validation: ValidationStatus.ERROR,
      message: 'mensagem poltrona teste'
    }
  }
});

const changeDataAfterState = merge({
  passagem: {
    data: 'data teste'
  }
});

const changeHorarioAfterState = merge({
  passagem: {
    horario: {
      val: 0,
      text: 'horario teste'
    }
  }
});

describe('pesquisaPassagens reducer', () => {
  it('deve ter estado inicial', () => {
    expect(reducer()).toEqual(initialState);
  });

  it('não deve alterar estado', () => {
    expect(reducer(initialState, { type: 'ACTION_INVALIDO' }))
      .toEqual(initialState);
  });

  it('deve setar as cidades', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_CIDADES,
      payload: [1, 2, 3]
    })).toEqual(setCidadesAfterState);
  });

  it('deve setar os horarios', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_HORARIOS,
      payload: [4, 5, 6]
    })).toEqual(setHorariosAfterState);
  });

  it('deve setar as poltronas', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_POLTRONAS,
      payload: [7, 8, 9]
    })).toEqual(setPoltronasAfterState);
  });

  it('deve resetar o form passagens', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.RESET_FORM_PASSAGEM,
      payload: []
    })).toEqual(resetFormPassagemAfterState);
  });

  it('deve mudar o nome', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_NOME,
      payload: 'nome teste'
    })).toEqual(changeNomeAfterState);
  });

  it('deve setar o nome dirty', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_NOME_DIRTY
    })).toEqual(setNomeDirtyAfterState);
  });

  it('deve setar o nome validation', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_NOME_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem nome teste'
      }
    })).toEqual(setNomeValidationAfterState);
  });

  it('deve mudar o cpf', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_CPF,
      payload: 'cpf teste'
    })).toEqual(changeCpfAfterState);
  });

  it('deve setar o cpf dirty', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_CPF_DIRTY
    })).toEqual(setCpfDirtyAfterState);
  });

  it('deve setar o cpf validation', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_CPF_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem cpf teste'
      }
    })).toEqual(setCpfValidationAfterState);
  });

  it('deve mudar a origem', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_ORIGEM,
      payload: {
        val: 0,
        text: 'cidade origem teste'
      }
    })).toEqual(changeOrigemAfterState);
  });

  it('deve mudar o destino', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_DESTINO,
      payload: {
        val: 0,
        text: 'cidade destino teste'
      }
    })).toEqual(changeDestinoAfterState);
  });

  it('deve mudar a poltrona', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_POLTRONA,
      payload: '1,2,3'
    })).toEqual(changePoltronaAfterState);
  });

  it('deve setar a poltrona dirty', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_POLTRONA_DIRTY
    })).toEqual(setPoltronaDirtyAfterState);
  });

  it('deve setar a poltrona validation', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.SET_POLTRONA_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem poltrona teste'
      }
    })).toEqual(setPoltronaValidationAfterState);
  });

  it('deve mudar a data', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_DATA,
      payload: 'data teste'
    })).toEqual(changeDataAfterState);
  });

  it('deve mudar o horario', () => {
    expect(reducer(initialState, {
      type: CompraPassagemActionType.CHANGE_HORARIO,
      payload: {
        val: 0,
        text: 'horario teste'
      }
    })).toEqual(changeHorarioAfterState);
  });


});