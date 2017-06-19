import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Jumbotron, Row, Col, Button, Glyphicon } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { resetFormPassagem } from '../actions/formPassagem.actions'
import { withAuth } from '../shared/hoc';

class ConfirmaPassagem extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.dispatch(resetFormPassagem());
    this.props.history.push('/');
  }

  render() {
    const { passagem } = this.props.location.state;
    return (
      <div className="confirmacao-passagem">
        <h2>Passagem comprada com sucesso!</h2>

        <Row>
          <Col xs={10} xsOffset={1}>
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