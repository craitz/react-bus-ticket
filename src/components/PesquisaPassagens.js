import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { withAuth } from '../shared/hoc';
import {
  Table,
  NavItem,
  Glyphicon,
  Label,
  Col,
  FormControl,
  Pagination,
  Jumbotron
} from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import * as actions from '../actions/pesquisaPassagens.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import DivAnimated from '../shared/DivAnimated'
import FontAwesome from 'react-fontawesome';
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';

export const totalPageItems = 12;

const TableHeader = ({ className, label, onClick, sortIcon }) =>
  <th className={className}>
    <span onClick={onClick}>{label}</span>
    {sortIcon}
  </th>

const TableColFilter = ({ tooltip, value, onChange }) =>
  <td>
    <TooltipOverlay text={tooltip} position="top">
      <FormControl value={value} onChange={onChange} />
    </TooltipOverlay>
  </td>

export const getGlyphEx = (fieldName, sort) => {
  if ((fieldName.length > 0) && (sort && (sort.field === fieldName))) {
    return (
      <Glyphicon
        glyph={(sort.direction) ? "sort-by-attributes" : "sort-by-attributes-alt"}
        className="th-icon"
      />
    );
  } else {
    return null;
  }
};

export const sortByFieldEx = (passagensBackup, sort) => {
  if (!passagensBackup) {
    return [];
  }

  const passagensOrdenadas = utils.deepCopy(passagensBackup);

  if (!sort || (sort.field.length === 0)) {
    return passagensOrdenadas;
  }

  passagensOrdenadas.sort((a, b) => {
    let objA = '';
    let objB = '';

    switch (sort.field) {
      case utils.PesquisaPassagensField.LINHA: {
        objA = a.origem.concat(a.destino);
        objB = b.origem.concat(b.destino);
        break;
      }
      case utils.PesquisaPassagensField.SAIDA: {
        objA = utils.buildIsoDate(a.data, a.horario);
        objB = utils.buildIsoDate(b.data, b.horario);
        break;
      }
      case utils.PesquisaPassagensField.COMPRA: {
        objA = a.dataCompra;
        objB = b.dataCompra;
        break;
      }
      default: {
      }
    }

    if (sort.direction) {
      if (objA > objB) {
        return 1;
      }
      if (objA < objB) {
        return -1;
      }
      return 0;
    } else {
      if (objA < objB) {
        return 1;
      }
      if (objA > objB) {
        return -1;
      }
      return 0;
    }
  });

  return passagensOrdenadas;
};

export const filtraPassagensEx = (passagensComOrdenacao, filter) => {
  if (!passagensComOrdenacao || !filter) {
    return [];
  }

  const passagensFiltradas = passagensComOrdenacao.filter((passagem) => {
    const compra = passagem.dataCompra;
    const saida = passagem.data.concat(passagem.horario);
    const linha = passagem.origem.toLowerCase().concat(passagem.destino.toLowerCase());
    const poltronas = passagem.poltrona.split(' - ');
    let include = true;

    if (filter.compra.length > 0) {
      include = include && (compra.includes(filter.compra));
    }

    if (filter.linha.length > 0) {
      include = include && (linha.includes(filter.linha));
    }

    if (filter.saida.length > 0) {
      include = include && (saida.includes(filter.saida));
    }

    if (filter.poltrona.length > 0) {
      const poltronasFiltro = filter.poltrona.split(',');

      include = include &&
        poltronas.find((poltrona) => {
          return poltronasFiltro.includes(poltrona);
        });
    }

    return include;
  });

  return passagensFiltradas;
};

export class PesquisaPassagens extends Component {
  constructor(props) {
    super(props);
    this.handleClickDataCompra = this.handleClickDataCompra.bind(this);
    this.handleClickLinha = this.handleClickLinha.bind(this);
    this.handleClickSaida = this.handleClickSaida.bind(this);
    this.handleChangeFilterDataCompra = this.handleChangeFilterDataCompra.bind(this);
    this.handleChangeFilterLinha = this.handleChangeFilterLinha.bind(this);
    this.handleChangeFilterSaida = this.handleChangeFilterSaida.bind(this);
    this.handleChangeFilterPoltrona = this.handleChangeFilterPoltrona.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handleSelectPage = this.handleSelectPage.bind(this);
    this.passagensBackup = [];
  }

  getGlyph(fieldName) {
    return getGlyphEx(fieldName, this.props.consulta.sort);
  }

  sortByField() {
    return sortByFieldEx(this.passagensBackup, this.props.consulta.sort)
  }

  filtraPassagens(passagensComOrdenacao) {
    return filtraPassagensEx(passagensComOrdenacao, this.props.consulta.filter);
  }

  getTotalPages(passagens) {
    if (!passagens || (passagens.length === 0)) {
      return 0;
    }

    const total = passagens.length;
    const quot = parseInt((total / totalPageItems), 10);
    const rest = total % totalPageItems
    return (rest > 0) ? (quot + 1) : quot;
  }

  buildPage(passagemOrdenadaFiltrada) {
    const { dispatch, consulta } = this.props;
    const { activePage } = consulta;
    let newActivePage = activePage;

    if (!passagemOrdenadaFiltrada || (passagemOrdenadaFiltrada.length === 0)) {
      dispatch(actions.setActivePage(0));
      dispatch(actions.setPage([]));
      return;
    }

    const total = this.getTotalPages(passagemOrdenadaFiltrada);

    if (activePage === 0) {
      newActivePage = 1;
    } else if (activePage > total) {
      newActivePage = total;
    }

    const start = (newActivePage - 1) * totalPageItems;
    const end = newActivePage * totalPageItems;
    const newPage = utils.deepCopy(passagemOrdenadaFiltrada.slice(start, end));

    dispatch(actions.setActivePage(newActivePage));
    dispatch(actions.setPage(newPage));
  }

  componentWillMount() {
    const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUserEmail());
    const ref = `passagens/${emailFirebase}`;

    firebaseHelper.fetch(ref).then((passagensObj) => {
      const passagensArray = utils.objToArray(passagensObj);
      this.passagensBackup = utils.deepCopy(passagensArray);
      this.handleReset();
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  handleSelectPage(eventKey) {
    const { passagens, dispatch } = this.props;

    dispatch(actions.setActivePageThunk(eventKey))
      .then(() => {
        this.buildPage(passagens);
      });
  }

  handleReset() {
    this.props.dispatch(actions.resetConsultaThunk())
      .then(() => {
        this.aplicaPesqusia();
      });
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/comprar');
  }

  aplicaPesqusia() {
    const arrSorted = this.sortByField();
    const arrSortedFiltered = this.filtraPassagens(arrSorted);
    this.buildPage(arrSortedFiltered);
    this.props.dispatch(actions.setPassagens(arrSortedFiltered));
  }

  handleClickDataCompra(event) {
    const { consulta, dispatch } = this.props;
    const { sort } = consulta;

    if (sort.field === utils.PesquisaPassagensField.COMPRA) {
      dispatch(actions.setSortDirectionThunk(!sort.direction))
        .then(() => {
          this.aplicaPesqusia();
        });
    } else {
      dispatch(actions.setSortThunk(utils.PesquisaPassagensField.COMPRA, true))
        .then(() => {
          this.aplicaPesqusia();
        });
    }
  }

  handleClickLinha(event) {
    const { consulta, dispatch } = this.props;
    const { sort } = consulta;

    if (sort.field === utils.PesquisaPassagensField.LINHA) {
      dispatch(actions.setSortDirectionThunk(!sort.direction))
        .then(() => {
          this.aplicaPesqusia();
        });
    } else {
      dispatch(actions.setSortThunk(utils.PesquisaPassagensField.LINHA, true))
        .then(() => {
          this.aplicaPesqusia();
        });
    }
  }

  handleClickSaida(event) {
    const { consulta, dispatch } = this.props;
    const { sort } = consulta;

    if (sort.field === utils.PesquisaPassagensField.SAIDA) {
      dispatch(actions.setSortDirectionThunk(!sort.direction))
        .then(() => {
          this.aplicaPesqusia();
        });
    } else {
      dispatch(actions.setSortThunk(utils.PesquisaPassagensField.SAIDA, true))
        .then(() => {
          this.aplicaPesqusia();
        });
    }
  }

  handleChangeFilterDataCompra(event) {
    const value = event.target.value;
    this.props.dispatch(actions.setFilterCompraThunk(value))
      .then(() => {
        this.aplicaPesqusia();
      });
  }

  handleChangeFilterLinha(event) {
    const value = event.target.value.toLowerCase();
    this.props.dispatch(actions.setFilterLinhaThunk(value))
      .then(() => {
        this.aplicaPesqusia();
      });
  }

  handleChangeFilterSaida(event) {
    const value = event.target.value;
    this.props.dispatch(actions.setFilterSaidaThunk(value))
      .then(() => {
        this.aplicaPesqusia();
      });
  }

  handleChangeFilterPoltrona(event) {
    const value = event.target.value;
    this.props.dispatch(actions.setFilterPoltronaThunk(value))
      .then(() => {
        this.aplicaPesqusia();
      });
  }

  render() {
    const { passagens, consulta } = this.props;
    const { filter, activePage, page } = consulta;
    const fields = utils.PesquisaPassagensField;
    const totalPages = this.getTotalPages(passagens);

    return (
      <div className="pesquisar-passagens-container">
        <PageHeader title="Histórico de compras" className="hidden-xs" />
        <PageHeader title="Histórico" className="visible-xs" />
        {/*<NavItem className="resultados hidden-sm" href="#">
            <FontAwesome className={passagens.length > 0 ? "icon text-success" : "icon text-danger"} name={passagens.length > 0 ? "check" : "times"} />
            <span className="text-after-icon">{passagens.length} resultados encontrados</span>
          </NavItem>
          <PageHeaderItem tooltip="Comprar passagens" glyph="shopping-cart" onClick={this.handleComprarPassagem} />
          <PageHeaderItem tooltip="Limpar filtros" glyph="eraser" onClick={this.handleReset} />
        </PageHeader>*/}
        <DivAnimated>
          <Col md={10} mdOffset={1}>
            <Pagination
              bsSize="medium"
              items={totalPages > 1 ? totalPages : 0}
              activePage={activePage}
              onSelect={this.handleSelectPage}
              className="pagination-pesquisa mui--z2"
            />
            <Jumbotron className="mui--z2">
              <Table responsive hover>
                <thead>
                  <tr>
                    <TableHeader
                      className="th-data-compra"
                      onClick={this.handleClickDataCompra}
                      label="Data da compra"
                      sortIcon={this.getGlyph(fields.COMPRA)}
                    />
                    <TableHeader
                      className="th-linha"
                      onClick={this.handleClickLinha}
                      label="Linha"
                      sortIcon={this.getGlyph(fields.LINHA)}
                    />
                    <TableHeader
                      className="th-saida"
                      onClick={this.handleClickSaida}
                      label="Saída"
                      sortIcon={this.getGlyph(fields.SAIDA)}
                    />
                    <th>Poltrona(s)</th>
                  </tr>
                </thead>
                <tbody className="text-left">
                  <tr>
                    <TableColFilter
                      tooltip="Pesquisar pela data da compra da passagem"
                      value={filter.compra}
                      onChange={this.handleChangeFilterDataCompra}
                    />
                    <TableColFilter
                      tooltip="Pesquisar pela origem e destino da viagem"
                      value={filter.linha}
                      onChange={this.handleChangeFilterLinha}
                    />
                    <TableColFilter
                      tooltip="Pesquisar pela data e horário de saída"
                      value={filter.saida}
                      onChange={this.handleChangeFilterSaida}
                    />
                    <TableColFilter
                      tooltip="Pesquisar por poltrona(s). Se necessário, separe por vírgulas"
                      value={filter.poltrona}
                      onChange={this.handleChangeFilterPoltrona}
                    />
                  </tr>
                  {page.map((value, index) =>
                    <tr key={index}>
                      <td>
                        {value.dataCompra}
                      </td>
                      <td>
                        <span>{value.origem}</span>
                        <Glyphicon glyph="arrow-right" className="icon-table arrow-trajeto" />
                        <span>{value.destino}</span>
                      </td>
                      <td>
                        <Glyphicon glyph="calendar" className="icon-table data" />
                        <span>{value.data}</span>
                        <Glyphicon glyph="time" className="icon-table horario" />
                        <span>{value.horario}</span>
                      </td>
                      <td>
                        {value.poltrona.split(' - ').map((value, index) =>
                          <Label key={index} bsStyle="danger" className="label-poltrona">{value}</Label>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Jumbotron>
          </Col>
        </DivAnimated>

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    passagens: state.pesquisaPassagensState.passagens,
    consulta: state.pesquisaPassagensState.consulta
  };
};

const PesquisaPassagensWithRouter = withRouter(PesquisaPassagens);
const PesquisaPassagensWithRouterAndAuth = withAuth(PesquisaPassagensWithRouter);
export default connect(mapStateToProps)(PesquisaPassagensWithRouterAndAuth);
