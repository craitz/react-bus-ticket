import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Row, Col, Modal, FormGroup, InputGroup, Label } from 'react-bootstrap';
import Select from 'react-select';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import * as actions from '../actions/modalTrajeto.actions';
import * as utils from '../shared/Utils'
import { withRouter } from 'react-router-dom'
import { ButtonIcon } from '../shared/ButtonIcon';
import InputDate from '../shared/InputDate';
import * as moment from 'moment';
import TooltipOverlay from '../shared/TooltipOverlay';

const AddOn = ({ tooltip, icon }) =>
  <TooltipOverlay text={tooltip} position="top">
    <InputGroup.Addon>
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
  <InputGroup>
    <AddOn tooltip={tooltip} icon={icon} />
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
    this.handleChangeOrigem = this.handleChangeOrigem.bind(this);
    this.handleChangeIdaVolta = this.handleChangeIdaVolta.bind(this);
    this.handleExited = this.handleExited.bind(this);
    this.onShow = this.onShow.bind(this);
    this.handleDatetimeKeyDown = this.handleDatetimeKeyDown.bind(this);
    this.handleChangeDataIda = this.handleChangeDataIda.bind(this);
    this.handleChangeDataVolta = this.handleChangeDataVolta.bind(this);
  }

  onShow() { }

  handleChangeDataIda(momentValue) {
    const { dispatch, data } = this.props;
    const isPristine = data.isPristine;
    const strData = momentValue.format('DD/MM/YYYY');

    this.props.dispatch(compraPassagemActions.changeData(strData));
    isPristine && dispatch(compraPassagemActions.setDataDirty());
    this.updateDataValidation(momentValue);
  }

  updateDataValidation(momentIda) {
    const { dispatch, dataVolta } = this.props;
    const momentVolta = moment(dataVolta.value, 'DD/MM/YYYY');

    if (momentIda.isAfter(momentVolta)) {
      const strDataIda = momentIda.format('DD/MM/YYYY');
      dispatch(compraPassagemActions.changeDataVolta(strDataIda));
    }
  }

  handleChangeDataVolta(momentValue) {
    const { dispatch, dataVolta } = this.props;
    const isPristine = dataVolta.isPristine;
    const strData = momentValue.format('DD/MM/YYYY');

    this.props.dispatch(compraPassagemActions.changeDataVolta(strData));
    isPristine && dispatch(compraPassagemActions.setDataVoltaDirty());
    this.updateDataVoltaValidation(momentValue);
  }

  updateDataVoltaValidation(momentVolta) {
    const { dispatch, data } = this.props;
    const momentIda = moment(data.value, 'DD/MM/YYYY');

    if (momentVolta.isBefore(momentIda)) {
      const strDataVolta = momentVolta.format('DD/MM/YYYY');
      dispatch(compraPassagemActions.changeData(strDataVolta));
    }
  }

  handleDatetimeKeyDown(event) {
    event.preventDefault();
  }

  handleChangeOrigem(value) {
    const { dispatch, origem, destino } = this.props;
    const isPristine = origem.isPristine;
    dispatch(compraPassagemActions.changeOrigem(value));
    isPristine && dispatch(compraPassagemActions.setOrigemDirty());

    this.updateOrigemValidation(value);

    // if ORIGEM is already selected in DESTINO, change DESTINO
    const origemVal = parseInt(value, 10);
    const destinoVal = parseInt(destino.value, 10);
    if (origemVal === destinoVal) {
      const newIndexDestino = (destinoVal === 0) ? (destinoVal + 1) : (destinoVal - 1);
      dispatch(compraPassagemActions.changeDestino(newIndexDestino.toString()));
    };
  }

  updateOrigemValidation(hasSelection) {
    const { dispatch, origem } = this.props;
    const oldOrigem = origem;

    // test required
    if (hasSelection) {
      (oldOrigem.validation !== utils.ValidationStatus.NONE) &&
        dispatch(compraPassagemActions.setOrigemValidation(utils.ValidationStatus.NONE, ''));
      return true;
    } else {
      (oldOrigem.validation !== utils.ValidationStatus.ERROR) &&
        dispatch(compraPassagemActions.setOrigemValidation(utils.ValidationStatus.ERROR, 'Campo obrigatório'));
      return false;
    }
  }

  updateDestinoValidation(hasSelection) {
    const { dispatch, destino } = this.props;
    const oldDestino = destino;

    // test required
    if (hasSelection) {
      (oldDestino.validation !== utils.ValidationStatus.NONE) &&
        dispatch(compraPassagemActions.setDestinoValidation(utils.ValidationStatus.NONE, ''));
      return true;
    } else {
      (oldDestino.validation !== utils.ValidationStatus.ERROR) &&
        dispatch(compraPassagemActions.setDestinoValidation(utils.ValidationStatus.ERROR, 'Campo obrigatório'));
      return false;
    }
  }

  handleChangeDestino(value) {
    const { dispatch, origem, destino } = this.props;
    const isPristine = destino.isPristine;
    dispatch(compraPassagemActions.changeDestino(value));
    isPristine && dispatch(compraPassagemActions.setDestinoDirty());

    this.updateDestinoValidation(value);

    // if ORIGEM is already selected in DESTINO, change DESTINO
    const origemVal = parseInt(origem.value, 10);
    const destinoVal = parseInt(value, 10);
    if (origemVal === destinoVal) {
      const newIndexOrigem = (origemVal === 0) ? (origemVal + 1) : (origemVal - 1);
      dispatch(compraPassagemActions.changeOrigem(newIndexOrigem.toString()));
    };
  };

  handleChangeIdaVolta() {
    const { dispatch, isIdaVolta } = this.props;
    dispatch(compraPassagemActions.setIdaVolta(!isIdaVolta));
  }

  handleExited() {
    const { dispatch } = this.props;
    dispatch(actions.setVisible(false));
  }

  handleSubmit(event) {
    event.preventDefault();
    const { history, dispatch, validation } = this.props;

    if (!validation.all) {
      return;
    }

    dispatch(actions.setVisible(false));
    history.push('/comprar');
  };

  render() {
    const { isVisible, origem, destino, cidades, isIdaVolta, isFromWelcome, data, dataVolta } = this.props;

    const getIcon = () => isIdaVolta ? 'exchange' : 'long-arrow-right';
    const getTitle = () => isFromWelcome ? 'Defina o trajeto' : 'Mude o trajeto';
    const getButtonLabel = () => isFromWelcome ? 'Buscar passagens' : 'Confirma e fechar';
    const getButtonIcon = () => isFromWelcome ? 'search' : 'check';

    const yesterday = moment().subtract(1, 'day');
    const futureDay = moment().add(5, 'days');
    const valid = (current) => current.isAfter(yesterday) && current.isBefore(futureDay);

    return (
      <Modal show={isVisible} className="modal-trajeto-container" onHide={this.handleExited} onShow={this.onShow}>
        <Modal.Header>
          <span>{getTitle()}</span>
          <FontAwesome name={getIcon()} className="pull-right ida-volta" onClick={this.handleChangeIdaVolta} />
        </Modal.Header>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <FormGroup controlId="origem" validationState={origem.validation}>
              <SelectTrajeto
                list={cidades}
                value={origem.value}
                placeholder="Escolha a origem"
                onChange={this.handleChangeOrigem}
                icon="location-arrow"
                tooltip="Origem"
              />
              <ErrorBlock message={origem.message} />
            </FormGroup>
            <FormGroup controlId="destino" validationState={destino.validation}>
              <SelectTrajeto
                list={cidades}
                value={destino.value}
                placeholder="Escolha o destino"
                onChange={this.handleChangeDestino}
                icon="map-marker"
                tooltip="Destino"
              />
              <ErrorBlock message={destino.message} />
            </FormGroup>
            <Row>
              <Col xs={isIdaVolta ? 6 : 12} className="col-ida">
                <FormGroup controlId="data-ida" validationState={data.validation}>
                  <InputGroup>
                    <AddOn tooltip="Data de ida" icon="arrow-right" />
                    <InputDate
                      value={data.value}
                      placeholder="Dia da ida"
                      isValidDate={valid}
                      onChange={this.handleChangeDataIda} />
                  </InputGroup>
                  <ErrorBlock message={data.message} />
                </FormGroup>
              </Col>
              {isIdaVolta &&
                <Col xs={6} className="col-volta">
                  <FormGroup controlId="data-volta" validationState={dataVolta.validation}>
                    <InputGroup>
                      <AddOn tooltip="Data de volta" icon="arrow-left" />
                      <InputDate
                        value={dataVolta.value}
                        placeholder="Dia da volta"
                        isValidDate={valid}
                        onChange={this.handleChangeDataVolta} />
                    </InputGroup>
                    <ErrorBlock message={dataVolta.message} />
                  </FormGroup>
                </Col>
              }
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <ButtonIcon
              type="submit"
              className="btn-block btn-google-glass"
              label={getButtonLabel()}
              icon={getButtonIcon()} />
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
    origem: passagem.origem,
    destino: passagem.destino,
    origemVolta: passagemVolta.origem,
    destinoVolta: passagemVolta.destino,
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


