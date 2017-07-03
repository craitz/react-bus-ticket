import React from 'react';
import store from '../store';
import { shallow, mount } from 'enzyme';
import Immutable from 'seamless-immutable';
import { Glyphicon } from 'react-bootstrap';
import PesquisaPassagens, {
  totalPageItems,
  getGlyphEx,
  sortByFieldEx,
  filtraPassagensEx
} from './PesquisaPassagens';
import { PesquisaPassagensField } from '../shared/Utils';
import { SequenceArray } from '../shared/Utils';
import { firebaseHelper } from '../shared/FirebaseHelper';

// mock passagem
const passagem = Immutable({
  cpf: "032.445.687-22",
  data: "23/08/2017",
  dataCompra: "26/06/2017",
  destino: "Florianópolis (SC)",
  email: "guest@busticket.com",
  horario: "10:00",
  nome: "Darth Vader",
  origem: "Rio de Janeiro (RJ)",
  poltrona: "35"
});

// mock consulta
const consulta = Immutable({
  sort: {
    field: '',
    direction: true
  },
  filter: {
    nome: '',
    compra: '',
    linha: '',
    saida: '',
    poltrona: ''
  },
  activePage: 1,
  page: []
});

const merge = (obj) => {
  return passagem.merge(obj, { deep: true });
}

const mergeConsulta = (obj) => {
  return consulta.merge(obj, { deep: true });
}

describe('PesquisaPassagens - VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <PesquisaPassagens store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});


describe('PesquisaPassagens - setPage()', () => {
  const wrapper = shallow(
    <PesquisaPassagens store={store} />
  );

  it('retorna [] se o array está vazio', () => {
    wrapper.instance().setPage([]);
    expect(Consulta.activePage).toBe(0);
    expect(Consulta.page).toEqual([]);
  });

  it('retorna [] se o array é nulo', () => {
    setPage(null);
    expect(Consulta.activePage).toBe(0);
    expect(Consulta.page).toEqual([]);
  });

  it('retorna [] se o array é undefined', () => {
    setPage(undefined);
    expect(Consulta.activePage).toBe(0);
    expect(Consulta.page).toEqual([]);
  });

  it('altera o activePage se era zero', () => {
    Consulta.activePage = 0;
    setPage(SequenceArray(20));
    expect(Consulta.activePage).toBe(1);
    expect(Consulta.page.length).toBe(totalPageItems);
  });

  it('altera o activePage quando alista dininui', () => {
    Consulta.activePage = 4;
    setPage(SequenceArray(20));
    expect(Consulta.activePage).toBe(2);
    expect(Consulta.page.length).toBe(8);
  });

  it('mantem o activePage quando a lista aumenta', () => {
    Consulta.activePage = 1;
    setPage(SequenceArray(121));
    expect(Consulta.activePage).toBe(1);
    expect(Consulta.page.length).toBe(totalPageItems);
  });
});

describe('PesquisaPassagens - getTotalPages()', () => {
  it('retorna [] se o array está vazio', () => {
    expect(getTotalPages([])).toBe(0);
  });

  it('retorna [] se o array é nulo', () => {
    expect(getTotalPages(null)).toBe(0);
  });

  it('retorna [] se o array é undefined', () => {
    expect(getTotalPages(undefined)).toBe(0);
  });

  it('retorna número de páginas quebrado', () => {
    expect(getTotalPages(SequenceArray(122))).toBe(11);
  });

  it('retorna número de páginas exato', () => {
    expect(getTotalPages(SequenceArray(240))).toBe(20);
  });

  it('retorna apenas 1 página', () => {
    expect(getTotalPages(SequenceArray(1))).toBe(1);
  });
});

describe('PesquisaPassagens - filtraPassagens()', () => {
  it('retorna [] se o array está vazio', () => {
    expect(filtraPassagensEx([], null)).toEqual([]);
  });

  it('retorna [] se o array é nulo', () => {
    expect(filtraPassagensEx(null, null)).toEqual([]);
  });

  it('retorna [] se o array é undefined', () => {
    expect(filtraPassagensEx(undefined, null)).toEqual([]);
  });

  it('filtra por nome', () => {
    const passagem1 = merge({
      nome: 'AABBCC',
    });
    const passagem2 = merge({
      nome: 'AABBBCC',
    });
    const passagens = [passagem1, passagem2];
    const mockFilter = { ...consulta.filter, nome: 'bbb' }

    expect(filtraPassagensEx(passagens, mockFilter)[0].nome).toBe('AABBBCC');
  });

  it('filtra por data da compra', () => {
    const passagem1 = merge({
      nome: 'AABBCC',
      dataCompra: '18/09/1974',
    });
    const passagem2 = merge({
      nome: 'AABBBCC',
      dataCompra: '22/09/1978',
    });
    const passagens = [passagem1, passagem2];

    resetConsulta();
    const mockFilter = { ...consulta.filter, compra: '78' }

    expect(filtraPassagens(passagens, mockFilter)[0].nome).toBe('AABBBCC');
  });

  it('filtra por linha', () => {
    const passagem1 = merge({
      nome: 'AABBCC',
      origem: 'Florianópolis (SC)',
      destino: 'Rio de Janeiro (RJ)',
    });
    const passagem2 = merge({
      nome: 'AABBBCC',
      origem: 'Fortaleza (CE)',
      destino: 'Aracajú (SE)',
    });

    const passagens = [passagem1, passagem2];

    resetConsulta();
    Consulta.filter.linha = 'ale';

    expect(filtraPassagens(passagens)[0].nome).toBe('AABBBCC');
  });

  it('filtra por saida', () => {
    const passagem1 = merge({
      nome: 'AABBCC',
      data: '30/10/2017',
      horario: '22:00'
    });
    const passagem2 = merge({
      nome: 'AABBBCC',
      data: '14/07/2017',
      horario: '06:00'
    });
    const passagens = [passagem1, passagem2];

    resetConsulta();
    Consulta.filter.saida = '07';

    expect(filtraPassagens(passagens)[0].nome).toBe('AABBBCC');
  });

  it('filtra por poltrona', () => {
    const passagem1 = passagem.merge({
      nome: 'AABBCC',
      poltrona: '1 - 41 - 42'
    });
    const passagem2 = passagem.merge({
      nome: 'AABBBCC',
      poltrona: '39 - 40 - 42'
    });
    const passagens = [passagem1, passagem2];

    resetConsulta();
    Consulta.filter.poltrona = '39,40';

    expect(filtraPassagens(passagens)[0].nome).toBe('AABBBCC');
  });
});

describe('PesquisaPassagens - sortByField()', () => {
  it('retorna [] se o array está vazio', () => {
    expect(sortByFieldEx([], null)).toEqual([]);
  });

  it('retorna [] se o array é nulo', () => {
    expect(sortByFieldEx(null, null)).toEqual([]);
  });

  it('retorna [] se o array é undefined', () => {
    expect(sortByFieldEx(undefined, null)).toEqual([]);
  });

  it('ordena por nome', () => {
    const passagem1 = passagem.merge({ nome: 'CBA' });
    const passagem2 = passagem.merge({ nome: 'ABC' });
    const passagens = [passagem1, passagem2];
    const mockSort = {
      field: PesquisaPassagensField.NOME,
      direction: true
    }
    expect(sortByFieldEx(passagens, mockSort)[0].nome).toBe('ABC');
  });

  it('ordena por data da compra', () => {
    const passagem1 = passagem.merge({ dataCompra: '22/09/1978' });
    const passagem2 = passagem.merge({ dataCompra: '18/09/1974' });
    const passagens = [passagem1, passagem2];
    const mockSort = {
      field: PesquisaPassagensField.COMPRA,
      direction: true
    }
    expect(sortByFieldEx(passagens, mockSort)[0].dataCompra).toBe('18/09/1974');
  });

  it('ordena por linha', () => {
    const passagem1 = passagem.merge({
      origem: 'Rio de Janeiro (RJ)',
      destino: 'Florianópolis (SC)'
    });
    const passagem2 = passagem.merge({
      origem: 'Florianópolis (SC)',
      destino: 'Rio de Janeiro (RJ)'
    });
    const passagens = [passagem1, passagem2];
    const mockSort = {
      field: PesquisaPassagensField.LINHA,
      direction: true
    }
    expect(sortByFieldEx(passagens, mockSort)[0].origem).toBe('Florianópolis (SC)');
  });

  it('ordena por saída', () => {
    const passagem1 = passagem.merge({
      data: '22/09/1978',
      horario: '18:00'
    });
    const passagem2 = passagem.merge({
      data: '22/09/1978',
      horario: '06:00'
    });
    const passagens = [passagem1, passagem2];
    const mockSort = {
      field: PesquisaPassagensField.SAIDA,
      direction: true
    }
    expect(sortByFieldEx(passagens, mockSort)[0].horario).toBe('06:00');
  });
});

describe('PesquisaPassagens - getGlyph()', () => {
  it('retorna null se field não está sendo pesquisado', () => {

    const wrapper = shallow(
      <PesquisaPassagens store={store} />
    );

    const mockSort = {
      field: PesquisaPassagensField.COMPRA,
      direction: true
    }

    expect(getGlyphEx(PesquisaPassagensField.LINHA, mockSort)).toBeNull();
  });

  it('retorna null se field vazio', () => {
    expect(getGlyphEx('', null)).toBeNull();
  });

  it('retorna null se field invalido', () => {
    expect(getGlyphEx('INVALID_FIELD', null)).toBeNull();
  });

  it('retorna gliph se field é igual', () => {
    const mockSort = {
      field: PesquisaPassagensField.COMPRA,
      direction: false
    };

    expect(getGlyphEx(PesquisaPassagensField.COMPRA, mockSort))
      .toEqual(<Glyphicon bsClass="glyphicon" className="th-icon" glyph="sort-by-attributes-alt" />);
  });
});