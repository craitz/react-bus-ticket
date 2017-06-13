import React, { Component } from 'react';
import store from '../store';
import PropTypes from 'prop-types';
import { Jumbotron, Grid, Row, Col } from 'react-bootstrap';
import roboto from '../fonts/Roboto-Regular.ttf';

class ConfirmacaoPassagem extends Component {
  constructor(props) {
    super(props);

    this.labelStyle = {
      fontWeight: 'bold'
    }

    this.style = {
      fontSize: '18px',
      fontFamily: { roboto },
      padding: '50px',
      marginTop: '20px'
    }

    this.headerStyle = {
      fontFamily: { roboto },
    }
  }

  render() {
    const { passagem } = store.getState().formPassagemState;
    return (
      <div>
        <h2 style={this.headerStyle}>Passagem reservada com sucesso!</h2>
        <Jumbotron style={this.style}>
          <Grid>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Nome:</Col>
              {/*<Col xs={8} className="text-left">{passagem.nome.text}</Col>*/}
              <Col xs={7} className="text-left">Astrobérison</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>E-mail:</Col>
              {/*<Col xs={8} className="text-left">{passagem.email.text}</Col>*/}
              <Col xs={7} className="text-left">astr@gmail.com</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Origem:</Col>
              <Col xs={7} className="text-left">{passagem.origem.text}</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Destino:</Col>
              <Col xs={7} className="text-left">{passagem.destino.text}</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Poltrona:</Col>
              <Col xs={7} className="text-left">{passagem.poltrona.text}</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Data:</Col>
              <Col xs={7} className="text-left">{passagem.data}</Col>
            </Row>
            <Row>
              <Col xs={5} className="text-right" style={this.labelStyle}>Hora:</Col>
              <Col xs={7} className="text-left">{passagem.horario.text}</Col>
            </Row>
          </Grid>
        </Jumbotron>
      </div>
    );
  }
}

ConfirmacaoPassagem.PropTypes = {
  passagem: PropTypes.object.isRequired,
};

export default ConfirmacaoPassagem;