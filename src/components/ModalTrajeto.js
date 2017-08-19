import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Modal, FormGroup } from 'react-bootstrap';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown';
import IconButton from 'react-toolbox/lib/button/IconButton';
import Button from 'react-toolbox/lib/button/Button';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import * as actions from '../actions/modalTrajeto.actions';
import * as utils from '../shared/Utils'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment';
import TooltipOverlay from '../shared/TooltipOverlay';
import { firebaseHelper } from '../shared/FirebaseHelper';
import SpinnerButton from "../shared/SpinnerButton";

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
    this.handleFocusIda = this.handleFocusIda.bind(this);
    this.handleFocusVolta = this.handleFocusVolta.bind(this);
    this.handleFocusOrigem = this.handleFocusOrigem.bind(this);
    this.handleFocusDestino = this.handleFocusDestino.bind(this);
    this.state = {
      carregando: false,
      origemActive: false,
      destinoActive: false,
      idaActive: false,
      voltaActive: false
    };
  }

  handleFocusDestino() {
    this.setState({
      origemActive: false,
      destinoActive: true,
      idaActive: false,
      voltaActive: false
    });
  }

  handleFocusOrigem() {
    this.setState({
      origemActive: true,
      destinoActive: false,
      idaActive: false,
      voltaActive: false
    });
  }

  handleFocusIda() {
    this.setState({
      origemActive: false,
      destinoActive: false,
      idaActive: true,
      voltaActive: false
    });
  }

  handleFocusVolta() {
    this.setState({
      origemActive: false,
      destinoActive: false,
      idaActive: false,
      voltaActive: true
    });
  }

  handleChangeDataIda(value) {
    const momentValue = moment(value);
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

  handleChangeDataVolta(value) {
    const momentValue = moment(value);
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

    const showSpinner = () =>
      this.setState({
        carregando: true
      });

    const hideSpinner = () =>
      this.setState({
        carregando: false
      });

    showSpinner();
    // dispatch(loadingActions.setLoading('Procurando passagens...'));

    this.updateHorarios().then(() => {
      setTimeout(() => {
        // dispatch(loadingActions.setDone()); // esconde o loading
        dispatch(compraPassagemActions.SetFrozen(false)); // descongela o estado do form CompraPassagem
        dispatch(compraPassagemActions.setActiveAccordion(-1)); // recolhe o panel collapsed
        dispatch(compraPassagemActions.setActiveAccordionVolta(-1)); // recolhe o panel collapsed de volta
        dispatch(actions.setVisible(false)); // fecha o modal
        hideSpinner();

        setTimeout(() => {
          // seta o trajeto da volta
          dispatch(compraPassagemActions.changeOrigemVolta(destino.value)); // muda o destino
          dispatch(compraPassagemActions.changeDestinoVolta(origem.value)); // muda o destino

          // reseta os erros
          dispatch(compraPassagemActions.setErroSalvandoIda(false));
          dispatch(compraPassagemActions.setErroSalvandoVolta(false));

          history.push('/comprar'); // retorna ao form CompraPassagem
        }, 100); // 100ms para o form CompraPassagem ter tempo de descongelar
      }, 1000);
    });
  };

  render() {
    const { isVisible, origem, destino, cidades, isIdaVolta, data, dataVolta } = this.props;
    const loading = this.state.carregando;
    const containerClass = loading ? "modal-trajeto-container loading" : "modal-trajeto-container";
    const footerLabel = loading ? "Procurando passagens..." : "Buscar passagens";

    const getIcon = () => isIdaVolta ? 'swap_horiz' : 'trending_flat';
    const getTooltip = () => isIdaVolta ? 'Ida e volta' : 'Somente ida';

    const datetimeIda = utils.brStringToDate(data.value);
    const datetimeVolta = utils.brStringToDate(dataVolta.value);

    const txt = moment().format('DD/MM/YYYY');
    const datetimeMin = utils.brStringToDate(txt);

    const futureDay = moment().add(30, 'days');
    const txtMax = futureDay.format('DD/MM/YYYY');
    const datetimeMax = utils.brStringToDate(txtMax);

    return (
      <Modal show={isVisible} className={containerClass} onHide={this.handleExited}>
        <Modal.Header>
          <span>Defina o trajeto</span>
          <TooltipOverlay text={getTooltip()} position="right">
            <IconButton className="pull-right ida-volta" icon={getIcon()} primary onClick={this.handleChangeIdaVolta} />
          </TooltipOverlay>
        </Modal.Header>
        <form onSubmit={this.handleSubmit}>
          <Modal.Body>
            <FormGroup
              className={this.state.origemActive ? "active origem" : "origem"}
              controlId="origem"
              validationState={origem.validation}
            >
              <Dropdown
                auto
                onChange={this.handleChangeOrigem}
                source={cidades}
                value={origem.value}
                icon="my_location"
                label="De"
              />
            </FormGroup>
            <Row>
              <Col xs={12}>
                <FormGroup
                  className={this.state.destinoActive ? "active destino" : "destino"}
                  controlId="destino"
                  validationState={destino.validation}
                >
                  <Dropdown
                    auto
                    onChange={this.handleChangeDestino}
                    source={cidades}
                    value={destino.value}
                    icon="place"
                    label="Para"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs={12} className={isIdaVolta ? "col-ida-com-volta" : "col-ida"}>
                <FormGroup
                  className={this.state.idaActive ? "active data-ida" : "data-ida"}
                  controlId="data-ida"
                  validationState={data.validation}
                >
                  <DatePicker
                    label='Ida'
                    icon="today"
                    locale="pt"
                    onChange={this.handleChangeDataIda}
                    value={datetimeIda}
                    cancelLabel="Cancelar"
                    inputFormat={(value) => utils.formatDate(value)}
                    minDate={datetimeMin}
                    maxDate={datetimeMax}
                  />
                </FormGroup>
              </Col>
            </Row>

            {isIdaVolta &&
              <Row>
                <Col xs={12} className={isIdaVolta ? "col-volta-com-volta" : "col-volta"}>
                  <FormGroup
                    className={this.state.voltaActive ? "active data-volta" : "data-volta"}
                    controlId="data-volta"
                    validationState={dataVolta.validation}
                  >
                    <DatePicker
                      label='Volta'
                      icon="event"
                      locale="pt"
                      onChange={this.handleChangeDataVolta}
                      value={datetimeVolta}
                      cancelLabel="Cancelar"
                      inputFormat={(value) => utils.formatDate(value)}
                      minDate={datetimeMin}
                      maxDate={datetimeMax}
                    />
                  </FormGroup>
                </Col>
              </Row>
            }
          </Modal.Body>
          <Modal.Footer>
            <span>{footerLabel}</span>
            {loading && <ProgressBar className="footer-progress" mode="indeterminate" />}
          </Modal.Footer>
          <Button
            floating
            accent
            type="submit"
            className="mui--z2 btn-buscar"
            icon="search"
            disabled={loading}
          />
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


