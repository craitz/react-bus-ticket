import React, { Component } from 'react';
import { FormGroup, Row, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';
//import PropTypes from 'prop-types';
import DatePicker from './DatePicker.js';

class FormPassagem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      email: '',
      origem: '',
      destino: '',
      poltrona: '',
      data: '',
      horario: '',
    };
  }

  render() {
    return (
      <form action="">
        {/*NOME*/}
        <Row className="text-left">
          <Col xs={12}>
            <FormGroup controlId="nome">
              <ControlLabel>Nome *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.nome} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>

        {/*E_MAIL*/}
        <Row className="text-left">
          <Col xs={12} className="input-col">
            <FormGroup controlId="email">
              <ControlLabel>E-mail *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.email} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>

        {/*ORIGEM / DESTINO*/}
        <Row className="text-left">
          <Col md={6} className="input-col">
            <FormGroup controlId="origem">
              <ControlLabel>Origem *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.origem} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={6} className="input-col">
            <FormGroup controlId="destino">
              <ControlLabel>Destino *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.destino} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>

        {/*POLTRONA / DATA / HORARIO*/}
        <Row className="text-left">
          <Col md={4} className="input-col">
            <FormGroup controlId="poltrona">
              <ControlLabel>Poltrona *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.poltrona} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={4} className="input-col">
            <FormGroup controlId="data">
              <ControlLabel>data *</ControlLabel>
              <DatePicker idc="data"></DatePicker>
              <FormControl.Feedback />
            </FormGroup>
          </Col>
          <Col md={4} className="input-col">
            <FormGroup controlId="hora">
              <ControlLabel>Horário *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.horario} />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>

        <Button bsStyle="primary" className="btn-block">Reservar agora!</Button>
      </form >
    );
  }

}

// FormPassagem.PropTypes = {};
// FormPassagem.defaultProps = {}

export default FormPassagem;