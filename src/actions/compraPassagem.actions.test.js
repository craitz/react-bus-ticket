import * as actions from './compraPassagem.actions';
import { CompraPassagemActionType } from '../reducers/actionTypes'
import { ValidationStatus } from '../shared/Utils'

describe('compraPassagem actions', () => {
  it('deve setar as cidades', () => {
    expect(actions.setCidades(['C1', 'C2', 'C3'])).toEqual({
      type: CompraPassagemActionType.SET_CIDADES,
      payload: ['C1', 'C2', 'C3']
    });
  });

  it('deve setar os horários', () => {
    expect(actions.setHorarios(['H1', 'H2', 'H3'])).toEqual({
      type: CompraPassagemActionType.SET_HORARIOS,
      payload: ['H1', 'H2', 'H3']
    });
  });

  it('deve setar as poltronas', () => {
    expect(actions.setPoltronas(['P1', 'P2', 'P3'])).toEqual({
      type: CompraPassagemActionType.SET_POLTRONAS,
      payload: ['P1', 'P2', 'P3']
    });
  });

  it('deve resetar o form passagem', () => {
    expect(actions.resetFormPassagem(['C1', 'C2', 'C3'])).toEqual({
      type: CompraPassagemActionType.RESET_FORM_PASSAGEM,
      payload: ['C1', 'C2', 'C3']
    });
  });

  it('deve mudar o nome', () => {
    expect(actions.changeNome('nome teste')).toEqual({
      type: CompraPassagemActionType.CHANGE_NOME,
      payload: 'nome teste'
    });
  });

  it('deve mudar o cpf', () => {
    expect(actions.changeCpf('cpf teste')).toEqual({
      type: CompraPassagemActionType.CHANGE_CPF,
      payload: 'cpf teste'
    });
  });

  it('deve mudar a origem', () => {
    expect(actions.changeOrigem({
      val: 0,
      text: 'C1'
    })).toEqual({
      type: CompraPassagemActionType.CHANGE_ORIGEM,
      payload: {
        val: 0,
        text: 'C1'
      }
    });
  });

  it('deve mudar o destino', () => {
    expect(actions.changeDestino({
      val: 0,
      text: 'C2'
    })).toEqual({
      type: CompraPassagemActionType.CHANGE_DESTINO,
      payload: {
        val: 0,
        text: 'C2'
      }
    });
  });

  it('deve mudar a poltrona', () => {
    expect(actions.changePoltrona('P1,P2,P3')).toEqual({
      type: CompraPassagemActionType.CHANGE_POLTRONA,
      payload: 'P1,P2,P3'
    });
  });

  it('deve mudar a data', () => {
    expect(actions.changeData('data teste')).toEqual({
      type: CompraPassagemActionType.CHANGE_DATA,
      payload: 'data teste'
    });
  });

  it('deve mudar o horário', () => {
    expect(actions.changeHorario({
      val: 0,
      text: 'H1'
    })).toEqual({
      type: CompraPassagemActionType.CHANGE_HORARIO,
      payload: {
        val: 0,
        text: 'H1'
      }
    });
  });

});