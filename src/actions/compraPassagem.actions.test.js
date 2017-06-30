import * as actions from './compraPassagem.actions';
import { CompraPassagemActionType } from './actionTypes'
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

  it('deve setar o nome dirty', () => {
    expect(actions.setNomeDirty()).toEqual({
      type: CompraPassagemActionType.SET_NOME_DIRTY,
    });
  });

  it('deve setar o nome validation', () => {
    expect(actions.setNomeValidation(ValidationStatus.ERROR, 'mensagem nome test')).toEqual({
      type: CompraPassagemActionType.SET_NOME_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem nome test'
      }
    });
  });

  it('deve mudar o cpf', () => {
    expect(actions.changeCpf('cpf teste')).toEqual({
      type: CompraPassagemActionType.CHANGE_CPF,
      payload: 'cpf teste'
    });
  });

  it('deve setar o cpf dirty', () => {
    expect(actions.setCpfDirty()).toEqual({
      type: CompraPassagemActionType.SET_CPF_DIRTY,
    });
  });

  it('deve setar o cpf validation', () => {
    expect(actions.setCpfValidation(ValidationStatus.ERROR, 'mensagem cpf test')).toEqual({
      type: CompraPassagemActionType.SET_CPF_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem cpf test'
      }
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

  it('deve setar a poltrona dirty', () => {
    expect(actions.setPoltronaDirty()).toEqual({
      type: CompraPassagemActionType.SET_POLTRONA_DIRTY,
    });
  });

  it('deve setar a poltrona validation', () => {
    expect(actions.setPoltronaValidation(ValidationStatus.ERROR, 'mensagem poltrona test')).toEqual({
      type: CompraPassagemActionType.SET_POLTRONA_VALIDATION,
      payload: {
        validation: ValidationStatus.ERROR,
        message: 'mensagem poltrona test'
      }
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