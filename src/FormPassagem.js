import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
//import PropTypes from 'prop-types';
import DateField from './shared/DateField.js';
import InputField from './shared/InputField.js';
import SelectField from './shared/SelectField.js';

class FormPassagem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nome: '',
      email: '',
      origem: '',
      destino: '',
      poltrona: '',
      data: new Date().toLocaleDateString('pt-BR'),
      horario: '',
    };
    this.onChangeNome = this.onChangeNome.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeOrigem = this.onChangeOrigem.bind(this);
    this.onChangeDestino = this.onChangeDestino.bind(this);
    this.onChangePoltrona = this.onChangePoltrona.bind(this);
    this.onChangeData = this.onChangeData.bind(this);
    this.onChangeHorario = this.onChangeHorario.bind(this);
  }

  onChangeNome(event) {
    this.setState({ nome: event.target.value.toUpperCase() });
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value.toUpperCase() });
  }

  onChangeOrigem(event) {
    this.setState({ origem: event.target.value.toUpperCase() });
  }

  onChangeDestino(event) {
    this.setState({ destino: event.target.value.toUpperCase() });
  }

  onChangePoltrona(event) {
    this.setState({ poltrona: event.target.value.toUpperCase() });
  }

  onChangeData(value) {
    this.setState({ data: value });
  }

  onChangeHorario(event) {
    this.setState({ horario: event.target.value });
  }

  render() {
    const list = ['Fpolis', 'Blumenau', 'Itajaí', 'Balneário Camboriú'];
    const { nome, email, origem, destino, poltrona, data, horario } = this.state;

    return (
      <form action="">

        {/*NOME*/}
        <Row className="text-left">
          <Col xs={12}>
            <InputField id="nome" label="Nome" type="text" value={nome} onChange={this.onChangeNome} />
          </Col>
        </Row>

        {/*E_MAIL*/}
        <Row className="text-left">
          <Col xs={12} className="input-col">
            <InputField id="email" label="E-mail" type="email" value={email} onChange={this.onChangeEmail} />
          </Col>
        </Row>

        {/*ORIGEM / DESTINO*/}
        <Row className="text-left">
          <Col md={6} className="input-col">
            <SelectField id="origem" label="Origem" list={list} value={origem} onChange={this.onChangeOrigem} />
          </Col>
          <Col md={6} className="input-col">
            <SelectField id="destino" label="Destino" list={list} value={destino} onChange={this.onChangeDestino} />
          </Col>
        </Row>

        {/*POLTRONA / DATA / HORARIO*/}
        <Row className="text-left">
          <Col md={4} className="input-col">
            <SelectField id="poltrona" label="Poltrona" list={list} value={poltrona} onChange={this.onChangePoltrona} />
          </Col>
          <Col md={4} className="input-col">
            <DateField id="data" label="Data" value={data} onChange={this.onChangeData} />
          </Col>
          <Col md={4} className="input-col">
            <SelectField id="horario" label="Horário" list={list} value={horario} onChange={this.onChangeHorario} />
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