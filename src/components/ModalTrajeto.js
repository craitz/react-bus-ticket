import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, FormGroup, InputGroup, Label } from 'react-bootstrap';
import Select from 'react-select';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import * as actions from '../actions/modalTrajeto.actions';
import * as utils from '../shared/Utils'
import { withRouter } from 'react-router-dom'
import InputDate from '../shared/InputDate';
import * as moment from 'moment';
import TooltipOverlay from '../shared/TooltipOverlay';
import { firebaseHelper } from '../shared/FirebaseHelper';
import FontAwesome from 'react-fontawesome';
import Button from 'react-toolbox/lib/button/Button';

const AddOn = ({ tooltip, icon, className }) =>
  <TooltipOverlay text={tooltip} position="top">
    <InputGroup.Addon className={className}>
      <FontAwesome name={icon} />
    </InputGroup.Addon>
  </TooltipOverlay>

const ErrorBlock = ({ message }) => {
  if (message.length === 0) {
    return null;
  }

  return (
    <div className="bloco-ajuda">
      <Label>
        <FontAwesome name="exclamation" />
        <span className="text-after-icon">{message}</span>
      </Label>
    </div>
  );
}

const SelectTrajeto = ({ list, value, placeholder, onChange, icon, tooltip }) =>
  // <Dropdown color="primary" label={value}>
  //   {
  //     list.map((item, index) => {
  //       return <DropdownItem
  //         key={index}
  //         value={value}
  //         onChange={onChange}>
  //         {item.label}
  //       </DropdownItem>
  //     })
  //   }
  // </Dropdown>
  <InputGroup>
    <AddOn tooltip={tooltip} icon={icon} className="addon-blue" />
    <Select
      simpleValue
      searchable={true}
      clearable={false}
      disabled={false}
      placeholder={placeholder}
      value={value}
      options={list}
      onChange={onChange}
      noResultsText="Nenhum resultado"
    />
  </InputGroup>

export class ModalTrajeto extends Component {
  constructor(props) {
    super(props);
    this.handleChangeOrigem = this.handleChangeOrigem.bind(this);
    this.handleChangeDestino = this.handleChangeDestino.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeIdaVolta = this.handleChangeIdaVolta.bind(this);
    this.handleExited = this.handleExited.bind(this);
    this.handleDatetimeKeyDown = this.handleDatetimeKeyDown.bind(this);
    this.handleChangeDataIda = this.handleChangeDataIda.bind(this);
    this.handleChangeDataVolta = this.handleChangeDataVolta.bind(this);
  }

  handleChangeDataIda(momentValue) {
    const { dispatch, data } = this.props;
    const isPristine = data.isPristine;
    const strData = momentValue.format('DD/MM/YYYY');

    this.props.dispatch(compraPassagemActions.changeData(strData)); // muda a data de ida
    isPristine && dispatch(compraPassagemActions.setDataDirty()); // seta dirty
    this.updateDataValidation(momentValue); // verifica validade das datas
  }

  updateDataValidation(momentIda) {
    const { dispatch, dataVolta } = this.props;
    const momentVolta = moment(dataVolta.value, 'DD/MM/YYYY');

    // se a ida é depois da volta, seta a volta
    // para a mesma data da ida
    if (momentIda.isAfter(momentVolta)) {
      const strDataIda = momentIda.format('DD/MM/YYYY');
      dispatch(compraPassagemActions.changeDataVolta(strDataIda));
    }
  }

  handleChangeDataVolta(momentValue) {
    const { dispatch, dataVolta } = this.props;
    const isPristine = dataVolta.isPristine;
    const strData = momentValue.format('DD/MM/YYYY');

    this.props.dispatch(compraPassagemActions.changeDataVolta(strData)); // muda a data de volta
    isPristine && dispatch(compraPassagemActions.setDataVoltaDirty()); // seta dirty
    this.updateDataVoltaValidation(momentValue); // verifica validade das datas
  }

  updateDataVoltaValidation(momentVolta) {
    const { dispatch, data } = this.props;
    const momentIda = moment(data.value, 'DD/MM/YYYY');

    // se a volta é antes da ida, seta a ida
    // para a mesma data da volta
    if (momentVolta.isBefore(momentIda)) {
      const strDataVolta = momentVolta.format('DD/MM/YYYY');
      dispatch(compraPassagemActions.changeData(strDataVolta));
    }
  }

  handleDatetimeKeyDown(event) {
    event.preventDefault(); // transforma os inputs data em readonly
  }

  handleChangeOrigem(value) {
    // Se limpou o input origem, cancela o evento e retorna sem fazer nada
    // Ou seja, o input nunca pode ficar vazio
    if (!value || value.length === 0) {
      return;
    }

    const { dispatch, origem, destino } = this.props;
    const isPristine = origem.isPristine;
    dispatch(compraPassagemActions.changeOrigem(value)); // muda a origem
    isPristine && dispatch(compraPassagemActions.setOrigemDirty()); // seta dirty

    // Se a origem é a mesma do destino, muda o destino
    const origemVal = parseInt(value, 10);
    const destinoVal = parseInt(destino.value, 10);
    if (origemVal === destinoVal) {
      const newIndexDestino = (destinoVal === 0) ? (destinoVal + 1) : (destinoVal - 1);
      dispatch(compraPassagemActions.changeDestino(newIndexDestino.toString()));
    };
  }

  handleChangeDestino(value) {
    // Se limpou o input destino, cancela o evento e retorna sem fazer nada
    // Ou seja, o input nunca pode ficar vazio
    if (!value || value.length === 0) {
      return;
    }

    const { dispatch, origem, destino } = this.props;
    const isPristine = destino.isPristine;
    dispatch(compraPassagemActions.changeDestino(value)); // muda o destino
    isPristine && dispatch(compraPassagemActions.setDestinoDirty()); // seta dirty

    // Se o destino é o mesmo da origem, muda a origem
    const origemVal = parseInt(origem.value, 10);
    const destinoVal = parseInt(value, 10);
    if (origemVal === destinoVal) {
      const newIndexOrigem = (origemVal === 0) ? (origemVal + 1) : (origemVal - 1);
      dispatch(compraPassagemActions.changeOrigem(newIndexOrigem.toString()));
    };
  };

  handleChangeIdaVolta() { // se clicou no toggle ida/ida-volta
    const { dispatch, isIdaVolta } = this.props;
    dispatch(compraPassagemActions.setIdaVolta(!isIdaVolta)); // toggle
  }

  handleExited() { // se cancelou as alterações
    const { dispatch, snapshot, isFromWelcome } = this.props;
    dispatch(actions.setVisible(false)); // fecha o modal
    dispatch(compraPassagemActions.SetFrozen(false)); // descongela o form ComprarPassagem

    // volta ao estado antes das alterações, caso tenha sido chamado do form ComprarPassagem
    !isFromWelcome && dispatch(compraPassagemActions.backToState(snapshot));
  }

  transformHorarios(snap, data, isVolta) {
    const { dispatch } = this.props;
    const horarios = snap.val();

    for (let horario in horarios) {
      const poltronas = horarios[horario];

      // se o horário já passou, desabilita o accordion
      poltronas.isDisabled = !utils.checkHorario(data, horario);

      for (let i = 0; i < 44; i++) {
        const strValue = (i + 1).toString().padStart(2, '0');
        poltronas[strValue] = (poltronas.hasOwnProperty(strValue))
          ? utils.PoltronaStatus.RESERVED : utils.PoltronaStatus.FREE;
      }
    }

    if (isVolta) {
      dispatch(compraPassagemActions.setHorariosVoltaBackup(horarios));
      dispatch(compraPassagemActions.changePoltronaVolta([]));
      dispatch(compraPassagemActions.changeHorarioVolta(''));
    } else {
      dispatch(compraPassagemActions.setHorariosBackup(horarios));
      dispatch(compraPassagemActions.changePoltrona([]));
      dispatch(compraPassagemActions.changeHorario(''));
    }

    return horarios;
  }

  updateHorarios() {
    return new Promise(resolve => {
      const { dispatch, cidades, origem, destino, data, dataVolta } = this.props;
      const strOrigem = cidades[origem.value].label;
      const strDestino = cidades[destino.value].label;
      const strData = utils.dateToFirebase(data.value);
      const strDataVolta = utils.dateToFirebase(dataVolta.value);
      const refIda = `saidas/${strOrigem}/${strDestino}/${strData}/`;
      const refVolta = `saidas/${strDestino}/${strOrigem}/${strDataVolta}/`;

      firebaseHelper.fetchSnapshot(refIda)
        .then(snapIda => {
          dispatch(compraPassagemActions.setHorarios(this.transformHorarios(snapIda, strData, false)));
          firebaseHelper.fetchSnapshot(refVolta)
            .then(snapVolta => {
              dispatch(compraPassagemActions.setHorariosVolta(this.transformHorarios(snapVolta, strDataVolta, true)));
              resolve();
            });
        });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history, dispatch, validation, origem, destino } = this.props;

    // se alguma validação falhou, retorna sem fazer nada
    if (!validation.all) {
      return;
    }

    this.updateHorarios().then(() => {
      dispatch(compraPassagemActions.SetFrozen(false)); // descongela o estado do form CompraPassagem
      dispatch(actions.setVisible(false)); // fecha o modal

      setTimeout(() => {
        // seta o trajeto da volta
        dispatch(compraPassagemActions.changeOrigemVolta(destino.value)); // muda o destino
        dispatch(compraPassagemActions.changeDestinoVolta(origem.value)); // muda o destino

        // reseta os erros
        dispatch(compraPassagemActions.setErroSalvandoIda(false));
        dispatch(compraPassagemActions.setErroSalvandoVolta(false));
        history.push('/comprar'); // retorna ao form CompraPassagem
      }, 100); // 100ms para o form CompraPassagem ter tempo de descongelar

    });
  };

  render() {
    const { isVisible, origem, destino, cidades, isIdaVolta, isFromWelcome, data, dataVolta } = this.props;

    const getIcon = () => isIdaVolta ? 'exchange fa-fw' : 'long-arrow-right fa-fw';
    const getTitle = () => isFromWelcome ? 'Defina o trajeto' : 'Mude o trajeto';
    const getButtonLabel = () => isFromWelcome ? 'Buscar' : 'Confirmar e fechar';
    const getButtonIcon = () => isFromWelcome ? 'search fa-fw' : 'check fa-fw';
    const getTooltip = () => isIdaVolta ? 'Ida e volta' : 'Somente ida';
    const yesterday = moment().subtract(1, 'day');
    const futureDay = moment().add(30, 'days');
    const valid = (current) => current.isAfter(yesterday) && current.isBefore(futureDay);

    return (
      <Modal show={isVisible} className="modal-trajeto-container" onHide={this.handleExited}>
        <Modal.Header>
          <span>{getTitle()}</span>
          <TooltipOverlay text={getTooltip()} position="right">
            <FontAwesome name={getIcon()} className="pull-right ida-volta" onClick={this.handleChangeIdaVolta} />
          </TooltipOverlay>
        </Modal.Header>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <FormGroup controlId="origem" validationState={origem.validation}>
              <SelectTrajeto
                list={cidades}
                value={origem.value}
                placeholder="Escolha a origem"
                onChange={this.handleChangeOrigem}
                icon="location-arrow fa-fw"
                tooltip="Origem"
              />
              <ErrorBlock message={origem.message} />
            </FormGroup>
            <Row>
              <Col xs={12}>
                <FormGroup controlId="destino" validationState={destino.validation}>
                  <SelectTrajeto
                    list={cidades}
                    value={destino.value}
                    placeholder="Escolha o destino"
                    onChange={this.handleChangeDestino}
                    icon="map-marker fa-fw"
                    tooltip="Destino"
                  />
                  {/*<ErrorBlock message={destino.message} />*/}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={isIdaVolta ? "col-ida-com-volta" : "col-ida"}>
                <FormGroup controlId="data-ida" validationState={data.validation}>
                  <InputGroup>
                    <AddOn tooltip="Data de ida" icon="arrow-right fa-fw" className="addon-green" />
                    <InputDate
                      value={data.value}
                      placeholder="Dia da ida"
                      isValidDate={valid}
                      onChange={this.handleChangeDataIda} />
                  </InputGroup>
                  {/*<ErrorBlock message={data.message} />*/}
                </FormGroup>
              </Col>
            </Row>

            {isIdaVolta &&
              <Row>
                <Col xs={12} className={isIdaVolta ? "col-volta-com-volta" : "col-volta"}>
                  <FormGroup controlId="data-volta" validationState={dataVolta.validation}>
                    <InputGroup>
                      <AddOn tooltip="Data de volta" icon="arrow-left fa-fw" className="addon-red" />
                      <InputDate
                        value={dataVolta.value}
                        placeholder="Dia da volta"
                        isValidDate={valid}
                        onChange={this.handleChangeDataVolta} />
                    </InputGroup>
                    <ErrorBlock message={dataVolta.message} />
                  </FormGroup>
                </Col>
              </Row>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button
              raised
              primary
              type="submit"
              className="btn-block">
              <FontAwesome name={getButtonIcon()} className="bt-mui-icon" />
              <span className="text-after-icon bt-mui-text">{getButtonLabel()}</span>
            </Button>
          </Modal.Footer>
        </form>
      </Modal >
    );
  }
};

const mapStateToProps = (state) => {
  const { passagem, passagemVolta } = state.compraPassagemState;
  const error = utils.ValidationStatus.ERROR;

  return {
    isVisible: state.modalTrajetoState.isVisible,
    isFromWelcome: state.modalTrajetoState.isFromWelcome,
    snapshot: state.modalTrajetoState.snapshot,
    origem: passagem.origem,
    destino: passagem.destino,
    // origemVolta: passagemVolta.origem,
    // destinoVolta: passagemVolta.destino,
    data: passagem.data,
    dataVolta: passagemVolta.data,
    cidades: state.compraPassagemState.cidades,
    isIdaVolta: state.compraPassagemState.isIdaVolta,
    validation: {
      origem: passagem.origem.validation !== error,
      destino: passagem.destino.validation !== error,
      all: ((passagem.origem.validation !== error) && (passagem.destino.validation !== error))
    }
  }
};

// ModalTrajeto.PropTypes = {}
// ModalTrajeto.defaultProps = {}

const ModalTrajetoWithRouter = withRouter(ModalTrajeto);
export default connect(mapStateToProps)(ModalTrajetoWithRouter);


