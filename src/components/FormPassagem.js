import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { Row, Col, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { BaseField, withInput, withSelect, withDate } from '../shared/FormFields';
import * as actions from '../actions/formPassagem.actions';
import { newPassagem } from '../actions/compraPassagem.actions';
import { validateRequired } from '../shared/Utils'

const InputField = withInput(BaseField);
const SelectField = withSelect(BaseField);
const DateField = withDate(BaseField);

const mapStateToProps = (state) => {
  return {
    passagem: state.formPassagemState.passagem,
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

  componentDidMount() {
    // initialize ORIGEM values
    this.props.dispatch(actions.changeOrigem({
      val: 0,
      text: this.props.cidades[0]
    }));

    // initialize DESTINO values
    this.props.dispatch(actions.changeDestino({
      val: 1,
      text: this.props.cidades[1]
    }));

    // initialize POLTRONA values
    this.props.dispatch(actions.changePoltrona({
      val: 0,
      text: this.props.poltronas[0]
    }));

    // initialize HORARIO values
    this.props.dispatch(actions.changeHorario({
      val: 0,
      text: this.props.horarios[0]
    }));
  }

  handleChangeNome(event) {
    this.isNomePristine = false;
    this.props.dispatch(actions.changeNome(event.target.value));
  }

  handleChangeEmail(event) {
    this.isEmailPristine = false;
    this.props.dispatch(actions.changeEmail(event.target.value));
  }

  handleChangeOrigem(event) {
    // build ORIGEM new state
    const origem = {
      val: Number(event.target.value),
      text: this.props.cidades[event.target.value]
    };
    // get DESTINO state
    const destino = {
      val: this.props.passagem.destino.val,
      text: this.props.passagem.destino.text
    };

    // change ORIGEM state!
    this.props.dispatch(actions.changeOrigem({
      val: origem.val,
      text: origem.text
    }));

    // if ORIGEM is already selected in DESTINO 
    if (origem.val === destino.val) {
      // calculate new index for DESTINO
      const newIndexDestino = (destino.val === 0) ? (destino.val + 1) : (destino.val - 1);

      // change DESTINO state!
      this.props.dispatch(actions.changeDestino({
        val: newIndexDestino,
        text: this.props.cidades[newIndexDestino]
      }));
    }
  }

  handleChangeDestino(event) {
    // build DESTINO new state
    const destino = {
      val: Number(event.target.value),
      text: this.props.cidades[event.target.value]
    };
    // get ORIGEM state
    const origem = {
      val: this.props.passagem.origem.val,
      text: this.props.passagem.origem.text
    };

    // change DESTINO state!
    this.props.dispatch(actions.changeDestino({
      val: destino.val,
      text: destino.text
    }));

    // if DESTINO is already selected in ORIGEM 
    if (destino.val === origem.val) {
      // calculate new index for ORIGEM
      const newIndexOrigem = (origem.val === 0) ? (origem.val + 1) : (origem.val - 1);

      // change ORIGEM state!
      this.props.dispatch(actions.changeOrigem({
        val: newIndexOrigem,
        text: this.props.cidades[newIndexOrigem]
      }));
    }
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
    // this.props.history.push('/passagem');
    // this.props.dispatch(newPassagem(this.props.passagem));
    event.preventDefault();
  }

  render() {
    // const { cidadesOrigem, cidadesDestino, horarios, poltronas, passagem } = this.props;
    const { cidades, horarios, poltronas, passagem } = this.props;

    // render!
    return (
      <form onSubmit={this.handleSubmit}>

        {/*NOME*/}
        <Row className="text-left">
          <Col xs={12}>
            <InputField
              id="nome"
              label="Nome*"
              type="text"
              value={passagem.nome.text}
              onChange={this.handleChangeNome}
              validation={validateRequired(passagem.nome)} />
          </Col>
        </Row>

        {/*E_MAIL*/}
        <Row className="text-left">
          <Col xs={12} className="input-col">
            <InputField
              id="email"
              label="E-mail*"
              type="email"
              value={passagem.email.text}
              onChange={this.handleChangeEmail}
              validation={validateRequired(passagem.email)} />
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

        <p><Link to="/passagem">Passagem!</Link></p>
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

export default connect(mapStateToProps)(FormPassagem);
