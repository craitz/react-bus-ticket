import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { withAuth } from '../shared/hoc';
import { Table, NavItem, Glyphicon, Navbar, Nav, Label, Grid, Row, Col } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import * as actions from '../actions/pesquisaPassagens.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
// import PropTypes from 'prop-types';

const sort = {
  field: utils.SortField.NONE,
  direction: true
}

class PesquisaPassagens extends Component {
  constructor(props) {
    super(props);
    this.handleClickDataCompra = this.handleClickDataCompra.bind(this);
    this.handleClickLinha = this.handleClickLinha.bind(this);
    this.handleClickSaida = this.handleClickSaida.bind(this);
  }

  componentWillMount() {
    const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUser().email);
    const ref = `passagens/${emailFirebase}`;

    firebaseHelper.fetch(ref).then((passagens) => {
      this.props.dispatch(actions.setPassagens(utils.objToArray(passagens)));
      this.forceUpdate();
    });
  }

  sortByField() {
    const passagensOrdenadas = [].concat(this.props.passagens);

    passagensOrdenadas.sort((a, b) => {
      let objA = null;
      let objB = null;

      switch (sort.field) {
        case utils.SortField.LINHA: {
          objA = a.origem.concat(a.destino);
          objB = b.origem.concat(b.destino);
          break;
        }
        case utils.SortField.SAIDA: {
          objA = utils.buildIsoDate(a.data, a.horario);
          objB = utils.buildIsoDate(b.data, b.horario);
          break;
        }
        case utils.SortField.COMPRA: {
          objA = a.dataCompra;
          objB = b.dataCompra;
        }
        default: {
          objA = a.dataCompra;
          objB = b.dataCompra;
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
    if (sort.field === utils.SortField.COMPRA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.SortField.COMPRA;
      sort.direction = true;
    }

    this.sortByField();
  }

  handleClickLinha(event) {
    if (sort.field === utils.SortField.LINHA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.SortField.LINHA;
      sort.direction = true;
    }

    this.sortByField();
  }

  handleClickSaida(event) {
    if (sort.field === utils.SortField.SAIDA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.SortField.SAIDA;
      sort.direction = true;
    }

    this.sortByField();
  }

  render() {
    const { passagens } = this.props;
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
                </th>
                <th className="th-linha">
                  <span onClick={this.handleClickLinha}>Linha</span>
                </th>
                <th className="th-saida">
                  <span onClick={this.handleClickSaida}>Saída</span>
                </th>
                <th>Poltrona(s)</th>
              </tr>
            </thead>
            <tbody className="text-left">
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
  };
};

const PesquisaPassagensWithRouter = withRouter(PesquisaPassagens);
const PesquisaPassagensWithRouterAndAuth = withAuth(PesquisaPassagensWithRouter);
export default connect(mapStateToProps)(PesquisaPassagensWithRouterAndAuth);
