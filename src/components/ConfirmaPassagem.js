import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Jumbotron,
  Row,
  Col,
  Button,
  Glyphicon,
  Grid,
  Nav,
  Navbar,
  NavItem
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
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.dispatch(actions.resetFormPassagem());
    this.props.history.push('/');
  }

  render() {
    const { passagem } = this.props.location.state;
    return (
      <div className="confirmacao-passagem">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Compra finalizada!" glyph="ok"></NavHeader>
            <Nav pullRight>
              <NavItem href="#">
                <TooltipOverlay text="Ver histórico de compras" position="top">
                  <Glyphicon className="icon-title links search" glyph="search" />
                </TooltipOverlay>
              </NavItem>
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Comprar nova passagem" position="top">
                  <Glyphicon className="icon-title links reset" glyph="shopping-cart" onClick={this.handleReset} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <div className="form-centered">
          <Grid>
            <Row>
              <Col md={6} mdOffset={3}>
                <Jumbotron>
                  <Row>
                    <Col xs={5} className="text-right title-label">Nome:</Col>
                    <Col xs={7} className="text-left">{passagem.nome.text}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">E-mail:</Col>
                    <Col xs={7} className="text-left">{passagem.email}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">Origem:</Col>
                    <Col xs={7} className="text-left">{passagem.origem.text}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">Destino:</Col>
                    <Col xs={7} className="text-left">{passagem.destino.text}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">Poltrona:</Col>
                    <Col xs={7} className="text-left">{passagem.poltrona.text}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">Data:</Col>
                    <Col xs={7} className="text-left">{passagem.data}</Col>
                  </Row>
                  <Row>
                    <Col xs={5} className="text-right title-label">Saída:</Col>
                    <Col xs={7} className="text-left">{passagem.horario.text}</Col>
                  </Row>
                </Jumbotron>
                <Row>
                  <Col xs={6}>
                    <Button type="button" bsStyle="primary" className="btn-block" onClick={this.handleComprarPassagem}>
                      <Glyphicon glyph="shopping-cart" />
                      <span className="text-after-icon">Continuar comprando</span>
                    </Button>
                  </Col>
                  <Col xs={6}>
                    <Button type="button" bsStyle="warning" className="btn-block">
                      <Glyphicon glyph="search" />
                      <span className="text-after-icon">Pesquisar comporas</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Grid>
        </div>
      </div>
    );
  }
}

ConfirmaPassagem.PropTypes = {
  passagem: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const ConfirmaPassagemWithRouter = withRouter(ConfirmaPassagem);
const ConfirmaPassagemWithRouterAndAuth = withAuth(ConfirmaPassagemWithRouter);
export default connect(mapStateToProps)(ConfirmaPassagemWithRouterAndAuth);