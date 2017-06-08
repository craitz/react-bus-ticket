import React, { Component } from 'react';
import * as firebase from 'firebase';
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
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleChangeData(value) {
    this.setState({ data: value });
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }

  componentDidMount() {
    const rootRef = firebase.database().ref().child('cidades');
    rootRef.on('value', snap => {
      this.setState({ cidades: snap.val() });
    });
  }

  render() {
    // mount mock lists
    const listCidades = ['Fpolis', 'Blumenau', 'Itajaí', 'Balneário Camboriú'];
    const listPoltronas = [...Array(42).keys()].map(i => ++i);
    const listHorarios = [...Array(17).keys()].map(i => {
      const is = (i + 6).toString();
      return (is.length === 1) ? `0${is}:00` : `${is}:00`;
    });

    // get the state of the component
    const { nome, email, origem, destino, poltrona, data, horario } = this.state;

    // render!
    return (
      <form onSubmit={this.handleSubmit}>

        {/*NOME*/}
        <Row className="text-left">
          <Col xs={12}>
            <InputField id="nome" label="Nome" type="text" value={nome} onChange={this.handleInputChange} />
          </Col>
        </Row>

        {/*E_MAIL*/}
        <Row className="text-left">
          <Col xs={12} className="input-col">
            <InputField id="email" label="E-mail" type="email" value={email} onChange={this.handleInputChange} />
          </Col>
        </Row>

        {/*ORIGEM / DESTINO*/}
        <Row className="text-left">
          <Col md={6} className="input-col">
            <SelectField id="origem" label="Origem" list={listCidades} value={origem} onChange={this.handleInputChange} />
          </Col>
          <Col md={6} className="input-col">
            <SelectField id="destino" label="Destino" list={listCidades} value={destino} onChange={this.handleInputChange} />
          </Col>
        </Row>

        {/*POLTRONA / DATA / HORARIO*/}
        <Row className="text-left">
          <Col md={4} className="input-col">
            <SelectField id="poltrona" label="Poltrona" list={listPoltronas} value={poltrona} onChange={this.handleInputChange} />
          </Col>
          <Col md={4} className="input-col">
            <DateField id="data" label="Data" value={data} onChange={this.handleChangeData} />
          </Col>
          <Col md={4} className="input-col">
            <SelectField id="horario" label="Horário" list={listHorarios} value={horario} onChange={this.handleInputChange} />
          </Col>
        </Row>

        <Button type="submit" bsStyle="primary" className="btn-block">Reservar agora!</Button>
      </form >
    );
  }

}

// FormPassagem.PropTypes = {};
// FormPassagem.defaultProps = {}

export default FormPassagem;