import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Row, Col, Modal, FormGroup, HelpBlock, InputGroup, FormControl } from 'react-bootstrap';
import Select from 'react-select';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import * as actions from '../actions/modalTrajeto.actions';
import * as utils from '../shared/Utils'
import { withRouter } from 'react-router-dom'
import { ButtonIcon } from '../shared/ButtonIcon';
import { BaseField, withSelect, withDate, withMultiSelect } from '../shared/FormFields';
import InputDate from '../shared/InputDate';
import moment from 'moment';

const DateField = withDate(BaseField);

let openDate = false;

const SelectTrajeto = ({ list, value, placeholder, onChange, icon }) =>
  <InputGroup>
    <InputGroup.Addon>
      <FontAwesome name={icon}></FontAwesome>
    </InputGroup.Addon>
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
    const data = momentValue.format('DD/MM/YYYY');
    this.props.dispatch(compraPassagemActions.changeData(data));
  }

  handleChangeDataVolta(momentValue) {
    const data = momentValue.format('DD/MM/YYYY');
    this.props.dispatch(compraPassagemActions.changeDataVolta(data));
  }

  handleDatetimeKeyDown(event) {
    event.preventDefault();
  }

  handleChangeOrigem(value) {
    const { dispatch, origem, destino } = this.props;
    const isPristine = origem.isPristine;
    dispatch(compraPassagemActions.changeOrigem(value));
    isPristine && dispatch(compraPassagemActions.setOrigemDirty());

    // this.updateOrigemValidation(value);

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
    } else {
      (oldOrigem.validation !== utils.ValidationStatus.ERROR) &&
        dispatch(compraPassagemActions.setOrigemValidation(utils.ValidationStatus.ERROR, 'Escolha uma origem'));
    }
  }

  handleChangeDestino(value) {
    const { dispatch, origem, destino } = this.props;
    const isPristine = destino.isPristine;
    dispatch(compraPassagemActions.changeDestino(value));
    isPristine && dispatch(compraPassagemActions.setDestinoDirty());

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
    const { history, dispatch, origem, destino } = this.props;

    if (!origem.value || !destino.value) {
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
              />
              <HelpBlock>{origem.message}</HelpBlock>
            </FormGroup>
            <FormGroup controlId="destino" validationState={destino.validation}>
              <SelectTrajeto
                list={cidades}
                value={destino.value}
                placeholder="Escolha o destino"
                onChange={this.handleChangeDestino}
                icon="map-marker"
              />
              <HelpBlock>{destino.message}</HelpBlock>
            </FormGroup>
            <Row>
              <Col xs={isIdaVolta ? 6 : 12}>
                <FormGroup controlId="data-ida">
                  <InputGroup>
                    <InputGroup.Addon>
                      <FontAwesome name="arrow-right" />
                    </InputGroup.Addon>
                    <InputDate
                      value={data}
                      placeholder="Dia da ida"
                      isValidDate={valid}
                      onChange={this.handleChangeDataIda} />
                  </InputGroup>
                </FormGroup>
              </Col>
              {isIdaVolta &&
                <Col xs={6}>
                  <FormGroup controlId="data-volta">
                    <InputGroup>
                      <InputGroup.Addon>
                        <FontAwesome name="arrow-left" />
                      </InputGroup.Addon>
                      <InputDate
                        value={dataVolta}
                        placeholder="Dia da volta"
                        isValidDate={valid}
                        onChange={this.handleChangeDataVolta} />
                    </InputGroup>
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
  return {
    isVisible: state.modalTrajetoState.isVisible,
    isFromWelcome: state.modalTrajetoState.isFromWelcome,
    origem: state.compraPassagemState.passagem.origem,
    destino: state.compraPassagemState.passagem.destino,
    origemVolta: state.compraPassagemState.passagemVolta.origem,
    destinoVolta: state.compraPassagemState.passagemVolta.destino,
    data: state.compraPassagemState.passagem.data,
    dataVolta: state.compraPassagemState.passagemVolta.data,
    cidades: state.compraPassagemState.cidades,
    isIdaVolta: state.compraPassagemState.isIdaVolta
  };
};

// ModalTrajeto.PropTypes = {}
// ModalTrajeto.defaultProps = {}

const ModalTrajetoWithRouter = withRouter(ModalTrajeto);
export default connect(mapStateToProps)(ModalTrajetoWithRouter);


