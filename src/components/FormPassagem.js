import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BaseField, withInput, withSelect, withDate } from '../shared/FormFields.js';
import store from '../store.js';
import * as actions from '../actions/passagemActions.js';

const InputField = withInput(BaseField);
const SelectField = withSelect(BaseField);
const DateField = withDate(BaseField);

const mapStateToProps = (state) => {
  return {
    passagem: state.passagem,
  };
};

class FormPassagem extends Component {
  constructor(props) {
    super(props);
    this.handleChangeNome = this.handleChangeNome.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeOrigem = this.handleChangeOrigem.bind(this);
    this.handleChangeDestino = this.handleChangeDestino.bind(this);
    this.handleChangePoltrona = this.handleChangePoltrona.bind(this);
    this.handleChangeHorario = this.handleChangeHorario.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeNome(event) {
    this.props.dispatch(actions.changeNome(event.target.value));
  }

  handleChangeEmail(event) {
    this.props.dispatch(actions.changeEmail(event.target.value));
  }

  handleChangeOrigem(event) {
    this.props.dispatch(actions.changeOrigem({
      val: event.target.value,
      text: event.target[event.target.value].text
    }));
  }

  handleChangeDestino(event) {
    this.props.dispatch(actions.changeDestino({
      val: event.target.value,
      text: event.target[event.target.value].text
    }));
  }

  handleChangePoltrona(event) {
    this.props.dispatch(actions.changePoltrona({
      val: event.target.value,
      text: event.target[event.target.value].text
    }));
  }

  handleChangeHorario(event) {
    this.props.dispatch(actions.changeHorario({
      val: event.target.value,
      text: event.target[event.target.value].text
    }));
  }

  handleChangeData(value) {
    this.props.dispatch(actions.changeData(value));
  }

  handleSubmit(event) {
    console.log(store.getState());
    event.preventDefault();
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;
    const passagem = this.props.passagem.passagem;

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
              onChange={this.handleChangeNome} />
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
              onChange={this.handleChangeEmail} />
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
              onChange={this.handleChangeOrigem} />
          </Col>
          <Col md={6} className="input-col">
            <SelectField
              id="destino"
              label="Destino"
              list={cidades}
              value={passagem.destino.val}
              onChange={this.handleChangeDestino} />
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
              onChange={this.handleChangePoltrona} />
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
              onChange={this.handleChangeHorario} />
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

export default connect(mapStateToProps)(FormPassagem);
