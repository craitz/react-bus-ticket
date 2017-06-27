import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Jumbotron,
  Row,
  Col,
  Glyphicon,
  Grid,
  Nav,
  Navbar,
  NavItem,
  Label
} from 'react-bootstrap';
import { NavHeader } from '../shared/Navigation';
import TooltipOverlay from '../shared/TooltipOverlay';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions/compraPassagem.actions'
import { withAuth } from '../shared/hoc';

class ConfirmaPassagem extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    // this.props.dispatch(actions.resetFormPassagem());
    this.props.history.push('/');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    const { novaPassagem, key } = this.props.location.state;
    return (
      <div className="confirmacao-passagem">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Compra finalizada!" glyph="ok-sign text-success"></NavHeader>
            <Nav pullRight>
              <NavItem href="#">
                <TooltipOverlay text="Ver histórico de compras" position="top">
                  <Glyphicon className="icon-title links search" glyph="search" onClick={this.handlePesquisarPassagens} />
                </TooltipOverlay>
              </NavItem>
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Comprar nova passagem" position="top">
                  <Glyphicon className="icon-title links reset" glyph="shopping-cart" onClick={this.handleComprarPassagem} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <div className="form-centered animated bounceInLeft">
          <Grid>
            <Row>
              <Col md={6} mdOffset={3} className="text-left">
                <div className="label-localizador">Seu código localizador é:</div>
                <Label bsStyle="success" className="localizador">{key}</Label>
                <div className="detalhes">
                  <span>Dados da passagem:</span>
                  <Jumbotron>
                    <div><strong>Nome:</strong> {novaPassagem.nome}</div>
                    <div><strong>CPF:</strong> {novaPassagem.cpf}</div>
                    {/*<div><strong>E-mail:</strong> {passagem.email}</div>*/}
                    <div><strong>Origem:</strong> {novaPassagem.origem}</div>
                    <div><strong>Destino:</strong> {novaPassagem.destino}</div>
                    <div><strong>Data:</strong> {novaPassagem.data}</div>
                    <div><strong>Saída:</strong> {novaPassagem.horario}</div>
                    <div><strong>Poltrona(s):</strong> {novaPassagem.poltrona}</div>
                  </Jumbotron>
                </div>
                <div>Parabéns pela sua compra e tenha uma boa viagem!</div>
                <div>Um e-mail foi enviado para <strong>{novaPassagem.email}</strong> com mais detalhes.</div>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

ConfirmaPassagem.PropTypes = {
  novaPassagem: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const ConfirmaPassagemWithRouter = withRouter(ConfirmaPassagem);
const ConfirmaPassagemWithRouterAndAuth = withAuth(ConfirmaPassagemWithRouter);
export default connect(mapStateToProps)(ConfirmaPassagemWithRouterAndAuth);