import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { withAuth } from '../shared/hoc';
import { Table, NavItem, Glyphicon, Navbar, Nav, Label, Grid, Row, Col, FormControl } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import * as actions from '../actions/pesquisaPassagens.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
// import PropTypes from 'prop-types';

const sort = {
  field: '',
  direction: true
}

class PesquisaPassagens extends Component {
  constructor(props) {
    super(props);
    this.handleClickDataCompra = this.handleClickDataCompra.bind(this);
    this.handleClickLinha = this.handleClickLinha.bind(this);
    this.handleClickSaida = this.handleClickSaida.bind(this);
    this.handleChangeFilterCompra = this.handleChangeFilterCompra.bind(this);
    this.handleChangeFilterLinha = this.handleChangeFilterLinha.bind(this);
    this.handleChangeFilterSaida = this.handleChangeFilterSaida.bind(this);
    this.passagensBackup = [];
  }

  componentWillMount() {
    const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUser().email);
    const ref = `passagens/${emailFirebase}`;

    firebaseHelper.fetch(ref).then((passagens) => {
      this.passagensBackup = [].concat(utils.objToArray(passagens));
      this.props.dispatch(actions.setPassagens(utils.objToArray(passagens)));
      this.forceUpdate();
    });
  }

  sortByField() {
    const passagensOrdenadas = [].concat(this.props.passagens);

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

    this.props.dispatch(actions.setPassagens(passagensOrdenadas));
  }

  handleClickDataCompra(event) {
    if (sort.field === utils.PesquisaPassagensField.COMPRA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.COMPRA;
      sort.direction = true;
    }

    this.sortByField();
  }

  handleClickLinha(event) {
    if (sort.field === utils.PesquisaPassagensField.LINHA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.LINHA;
      sort.direction = true;
    }

    this.sortByField();
  }

  handleClickSaida(event) {
    if (sort.field === utils.PesquisaPassagensField.SAIDA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.SAIDA;
      sort.direction = true;
    }

    this.sortByField();
  }

  handleChangeFilterCompra(event) {
    const { dispatch, filtros } = this.props;
    const value = event.target.value;

    dispatch(actions.setFiltroCompra(value));
    this.filtraPassagens({
      ...filtros,
      compra: value
    });
  }

  handleChangeFilterLinha(event) {
    const { dispatch, filtros } = this.props;
    const value = event.target.value.toLowerCase();

    dispatch(actions.setFiltroLinha(value));
    this.filtraPassagens({
      ...filtros,
      linha: value
    });
  }

  handleChangeFilterSaida(event) {
    const { dispatch, filtros } = this.props;
    const value = event.target.value;

    dispatch(actions.setFiltroSaida(value));
    this.filtraPassagens({
      ...filtros,
      saida: value
    });
  }

  filtraPassagens(filtros) {
    const { passagens } = this.props;

    const passagensFiltradas = this.passagensBackup.filter((passagem) => {
      const compra = passagem.dataCompra;
      const saida = passagem.data.concat(passagem.horario);
      const linha = passagem.origem.toLowerCase().concat(passagem.destino.toLowerCase());
      let include = true;

      if (filtros.compra.length > 0) {
        include = include && (compra.includes(filtros.compra));
      }

      if (filtros.linha.length > 0) {
        include = include && (linha.includes(filtros.linha));
      }

      if (filtros.saida.length > 0) {
        include = include && (saida.includes(filtros.saida));
      }

      return include;
    });

    this.props.dispatch(actions.setPassagens(passagensFiltradas));
  }

  getGlyph(field) {
    if (sort.field === field) {
      return (
        <Glyphicon
          glyph={(sort.direction) ? "sort-by-attributes" : "sort-by-attributes-alt"}
          className="th-icon"
        />
      );
    } else {
      return null;
    }
  }

  render() {
    const { passagens, filtros } = this.props;
    // console.log('render >>> ', passagens);
    return (
      <div className="pesquisar-passagens-container">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Histórico de passagens" glyph="tags"></NavHeader>
            <Nav pullRight>
              <NavItem href="/passagens">
                <TooltipOverlay text="Comprar passagem" position="top">
                  <Glyphicon className="icon-title links search" glyph="shopping-cart" />
                </TooltipOverlay>
              </NavItem>
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Limpar campos" position="top">
                  <Glyphicon className="icon-title links reset" glyph="erase" onClick={this.handleReset} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <Col md={8} mdOffset={2}>
          <Table responsive>
            <thead>
              <tr>
                <th className="th-data-compra">
                  <span onClick={this.handleClickDataCompra}>Data da compra</span>
                  {this.getGlyph(utils.PesquisaPassagensField.COMPRA)}
                </th>
                <th className="th-linha">
                  <span onClick={this.handleClickLinha}>Linha</span>
                  {this.getGlyph(utils.PesquisaPassagensField.LINHA)}
                </th>
                <th className="th-saida">
                  <span onClick={this.handleClickSaida}>Saída</span>
                  {this.getGlyph(utils.PesquisaPassagensField.SAIDA)}
                </th>
                <th>Poltrona(s)</th>
              </tr>
            </thead>
            <tbody className="text-left">
              <tr>
                <td>
                  <FormControl value={filtros.compra} onChange={this.handleChangeFilterCompra} />
                </td>
                <td>
                  <FormControl value={filtros.linha} onChange={this.handleChangeFilterLinha} />
                </td>
                <td>
                  <FormControl value={filtros.saida} onChange={this.handleChangeFilterSaida} />
                </td>
              </tr>
              {passagens.map((value, index) =>
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
        </Col>
      </div>
    );
  }
}

// PesquisaPassagens.PropTypes = {}
// PesquisaPassagens.defaultProps = {}

const mapStateToProps = (state) => {
  return {
    passagens: state.pesquisaPassagensState.passagens,
    filtros: state.pesquisaPassagensState.filtros
  };
};

const PesquisaPassagensWithRouter = withRouter(PesquisaPassagens);
const PesquisaPassagensWithRouterAndAuth = withAuth(PesquisaPassagensWithRouter);
export default connect(mapStateToProps)(PesquisaPassagensWithRouterAndAuth);
