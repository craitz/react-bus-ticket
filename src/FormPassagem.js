import React, { Component } from 'react';
import { FormGroup, Row, Col, ControlLabel, FormControl, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import datepicker from 'js-datepicker';
import '../node_modules/js-datepicker/datepicker.css';

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

  componentDidMount() {
    const picker = datepicker('.data-viagem', {
      position: 'tr', // Top right. 
      startDate: new Date(), // This month. 
      dateSelected: new Date(), // Today is selected. 
      minDate: new Date(), // June 1st, 2016. 
      maxDate: new Date(2099, 0, 1), // Jan 1st, 2099. 
      formatter: function (el, date) {
        // This will display the date as `1/1/2017`. 
        el.value = date.toLocaleDateString('pt-BR');
      },
    });
  }


  render() {
    return (
      <form action="">
        <FormGroup controlId="formBasicText">
          <Row className="text-left">
            <Col xs={12}>
              <ControlLabel>Nome *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.nome} />
              <FormControl.Feedback />
            </Col>
          </Row>
          <Row className="text-left">
            <Col xs={12} className="input-col">
              <ControlLabel>E-mail *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.email} />
              <FormControl.Feedback />
            </Col>
          </Row>
          <Row className="text-left">
            <Col md={6} className="input-col">
              <ControlLabel>Origem *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.origem} />
              <FormControl.Feedback />
            </Col>
            <Col md={6} className="input-col">
              <ControlLabel>Destino *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.destino} />
              <FormControl.Feedback />
            </Col>
          </Row>
          <Row className="text-left">
            <Col md={4} className="input-col">
              <ControlLabel>Poltrona *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.poltrona} />
              <FormControl.Feedback />
            </Col>
            <Col md={4} className="input-col">
              <ControlLabel>Data *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.data} className="data-viagem" readOnly />
              <FormControl.Feedback />
            </Col>
            <Col md={4} className="input-col">
              <ControlLabel>Horário *</ControlLabel>
              <FormControl type="text" defaultValue={this.state.horario} />
              <FormControl.Feedback />
            </Col>
          </Row>
        </FormGroup>
        <Button bsStyle="primary" className="btn-block">Reservar agora!</Button>
      </form>
    );
  }

}

FormPassagem.PropTypes = {};
FormPassagem.defaultProps = {}

export default FormPassagem;