import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BaseField, withInput, withSelect, withDate } from '../shared/FormFields.js';
import { DateNowBr } from '../shared/Utils.js';

const InputField = withInput(BaseField);
const SelectField = withSelect(BaseField);
const DateField = withDate(BaseField);

class FormPassagem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passagem: {
        nome: '',
        email: '',
        origem: {
          val: 0,
          text: props.cidades[0],
        },
        destino: {
          val: 1,
          text: props.cidades[1],
        },
        poltrona: {
          val: 0,
          text: props.poltronas[0],
        },
        data: DateNowBr,
        horario: {
          val: 0,
          text: props.horarios[0],
        }
      }
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleInputChange(event) {
    const { passagem } = this.state;
    passagem[event.target.id] = event.target.value;
    this.setState({ passagem });
  }

  handleSelectChange(event) {
    const { passagem } = this.state;
    passagem[event.target.id] = {
      val: event.target.value,
      text: event.target[event.target.value].text
    }
    this.setState({ passagem });
  }

  handleChangeData(value) {
    const { passagem } = this.state;
    passagem.data = value;
    this.setState({ passagem });
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;
    const { passagem } = this.state;
    console.log(this.state);
    // render!
    return (
      <form onSubmit={this.handleSubmit}>

        {/*NOME*/}
        <Row className="text-left">
          <Col xs={12}>
            <InputField
              id="nome"
              label="Nome"
              type="text"
              value={passagem.nome}
              onChange={this.handleInputChange} />
          </Col>
        </Row>

        {/*E_MAIL*/}
        <Row className="text-left">
          <Col xs={12} className="input-col">
            <InputField
              id="email"
              label="E-mail"
              type="email"
              value={passagem.email}
              onChange={this.handleInputChange} />
          </Col>
        </Row>

        {/*ORIGEM / DESTINO*/}
        <Row className="text-left">
          <Col md={6} className="input-col">
            <SelectField
              id="origem"
              label="Origem"
              list={cidades}
              value={passagem.origem.val}
              onChange={this.handleSelectChange} />
          </Col>
          <Col md={6} className="input-col">
            <SelectField
              id="destino"
              label="Destino"
              list={cidades}
              value={passagem.destino.val}
              onChange={this.handleSelectChange} />
          </Col>
        </Row>

        {/*POLTRONA / DATA / HORARIO*/}
        <Row className="text-left">
          <Col md={4} className="input-col">
            <SelectField
              id="poltrona"
              label="Poltrona"
              list={poltronas}
              value={passagem.poltrona.val}
              onChange={this.handleSelectChange} />
          </Col>
          <Col md={4} className="input-col">
            <DateField
              id="data"
              label="Data"
              value={passagem.data}
              onChange={this.handleChangeData} />
          </Col>
          <Col md={4} className="input-col">
            <SelectField
              id="horario"
              label="Horário"
              list={horarios}
              value={passagem.horario.val}
              onChange={this.handleSelectChange} />
          </Col>
        </Row>

        <Button type="submit" bsStyle="primary" className="btn-block">Reservar agora!</Button>
      </form >
    );
  }
}

FormPassagem.PropTypes = {
  cidades: PropTypes.array.isRequired,
  horarios: PropTypes.array.isRequired,
  poltronas: PropTypes.array.isRequired
};

FormPassagem.defaultProps = {
  cidades: [],
  horarios: [],
  poltronas: []
}

export default FormPassagem;