import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { withAuth } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import { Tabs, Tab, Jumbotron, Row, Grid, Label } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated'
import moment from 'moment';
import { PageHeader } from '../shared/PageHeader';
import * as loadingActions from '../actions/loadingDialog.actions'
import * as modalTrajetoActions from '../actions/modalTrajeto.actions'
import * as snackbarActions from '../actions/snackbar.actions'
import HorariosAccordion from './HorariosAccordion';
import { withNoResults } from '../shared/hoc';
import TooltipOverlay from '../shared/TooltipOverlay';
import idaLogo from '../styles/images/arrow-ida2.svg';
import voltaLogo from '../styles/images/arrow-volta2.svg';
import passengerGreenLogo from '../styles/images/passenger-green.svg';
import passengerRedLogo from '../styles/images/passenger-red.svg';
import arrowIdaLogo from '../styles/images/arrow-ida.svg';
import arrowVoltaLogo from '../styles/images/arrow-volta.svg';
import editLogo from '../styles/images/edit4.svg';
import markerLogo from '../styles/images/marker.svg';
import locationLogo from '../styles/images/location.svg';
import clearLogo from '../styles/images/clear.svg';
import comprarLogo from '../styles/images/comprar.svg';
import Button from 'react-toolbox/lib/button/Button';
import Snackbar from '../shared/Snackbar';

const ConfirmacaoPanel = ({ props }) => {
  const classDefault = 'detalhes-container mui--z2';
  const buildClassName = props.isIdaVolta ? `${classDefault} idavolta` : `${classDefault} soida`;
  const strHorarioIda = (props.horarioIda.length > 0) ? utils.firebaseToTime(props.horarioIda) : '';
  const strHorarioVolta = (props.horarioVolta.length > 0) ? utils.firebaseToTime(props.horarioVolta) : '';

  const sortPoltronas = (poltronas) => {
    const poltronasTemp = utils.deepCopy(poltronas);
    poltronasTemp.sort();
    return poltronasTemp.join(' | ');
  }

  const labelErro = (
    <Label bsStyle="danger" className="label-erro">
      <FontAwesome name="exclamation-triangle" />
      <span className="label-erro-text">Selecione uma poltrona</span>
    </Label>
  );

  return (
    <Jumbotron className={buildClassName}>
      <div className="aside">DETALHES DA PASSAGEM</div>
      <TooltipOverlay text="Alterar" position="top">
        <img src={editLogo} alt="Alterar" className="icon-edit" onClick={props.onChangeTrajeto} />
      </TooltipOverlay>
      <TooltipOverlay text="Limpar" position="top">
        <img src={clearLogo} alt="Limpar" className="icon-limpar-ida" onClick={props.onLimpaIda} />
      </TooltipOverlay>
      {
        props.isIdaVolta &&
        <TooltipOverlay text="Limpar" position="top">
          <img src={clearLogo} alt="Limpar" className="icon-limpar-volta" onClick={props.onLimpaVolta} />
        </TooltipOverlay>
      }
      <Grid className="detalhes-info text-left">
        <Row>
          <FontAwesome name="location-arrow fa-fw" className="origem" />
          {/*<img src={locationLogo} height="15" alt="" className="origem" />*/}
          <span className="text-after-icon">{props.origem}</span>
        </Row>
        <Row>
          <FontAwesome name="map-marker fa-fw" className="destino" />
          {/*<img src={markerLogo} height="20" alt="" className="destino" />*/}
          <span className="text-after-icon">{props.destino}</span>
        </Row>
        <hr />
        <Row>
          <FontAwesome name="arrow-right fa-fw" className="data-ida" />
          {/*<img src={arrowIdaLogo} height="15" alt="" className="data-ida" />*/}
          <span className="text-after-icon">{props.dataIda}</span>
        </Row>
        <Row>
          <FontAwesome name="clock-o fa-fw" className="hora-ida" />
          <span className="text-after-icon">{strHorarioIda}</span>
        </Row>
        <Row>
          <img src={passengerGreenLogo} height="16" width="20" alt="" className="icon-passenger" />
          {
            !props.hasErroSalvandoIda &&
            <span className="text-after-icon">{sortPoltronas(props.poltronasIda)}</span>
          }
          {props.hasErroSalvandoIda && labelErro}
        </Row>
        {props.isIdaVolta &&
          <div>
            <hr />
            <Row>
              <FontAwesome name="arrow-left fa-fw" className="data-volta" />
              {/*<img src={arrowVoltaLogo} height="15" alt="" className="data-volta" />*/}
              <span className="text-after-icon">{props.dataVolta}</span>
            </Row>
            <Row>
              <FontAwesome name="clock-o fa-fw" className="hora-volta" />
              <span className="text-after-icon">{strHorarioVolta}</span>
            </Row>
            <Row>
              <img src={passengerRedLogo} height="16" width="20" alt="" className="icon-passenger" />
              {
                !props.hasErroSalvandoVolta &&
                <span className="text-after-icon">{sortPoltronas(props.poltronasVolta)}</span>
              }
              {props.hasErroSalvandoVolta && labelErro}
            </Row>
          </div>}
        <hr />
        <Row>
          <Button
            raised
            primary
            className="btn-block btn-continuar"
            onClick={props.onContinua}>
            <FontAwesome name="check bt-mui-icon" />
            <span className="text-after-icon bt-mui-text">Finalizar compra</span>
          </Button>
          <small className="detalhes-warning">* Por favor, verifique os dados com atenção antes de finalizar o seu pedido.</small>
        </Row>
      </Grid>
    </Jumbotron>
  );
}

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
    this.activeTab = 1;
    this.handleReset = this.handleReset.bind(this);
    this.handleChangePoltrona = this.handleChangePoltrona.bind(this);
    this.handleChangeHorario = this.handleChangeHorario.bind(this);
    this.handleClickSeat = this.handleClickSeat.bind(this);
    this.handleResetSeats = this.handleResetSeats.bind(this);
    this.handleSaveSeats = this.handleSaveSeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
    this.handleChangeTrajeto = this.handleChangeTrajeto.bind(this);
    this.handleLimpaIda = this.handleLimpaIda.bind(this);
    this.handleLimpaVolta = this.handleLimpaVolta.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
  }

  handleSelectTab(event) {
    this.props.dispatch(actions.setActiveTab(event));
  }

  handleChangeTrajeto(event) {
    // event.preventDefault();
    const { dispatch, snapshot } = this.props;
    dispatch(actions.SetFrozen(true));
    dispatch(modalTrajetoActions.setVisible(true, false, snapshot));
  }

  enableAllHorarios(isVolta) {
    const { dispatch, cidades, horarios, horariosVolta, passagem, passagemVolta } = this.props;

    if (isVolta) {
      const temp = utils.deepCopy(horariosVolta)
      for (let horario in temp) {
        // Habilita todos, menos os horários que já passaram.
        const strData = utils.dateToFirebase(passagemVolta.data.value);
        temp[horario].isDisabled = !utils.checkHorario(strData, horario);
      }
      dispatch(actions.setHorariosVolta(temp));

    } else {
      const temp = utils.deepCopy(horarios)
      for (let horario in temp) {
        // Habilita todos, menos os horários que já passaram.
        const strData = utils.dateToFirebase(passagem.data.value);
        temp[horario].isDisabled = !utils.checkHorario(strData, horario);
      }
      dispatch(actions.setHorarios(temp));
    }
  }

  handleLimpaIda() {
    const { dispatch, passagem, horarios, horariosVolta, horariosBackup } = this.props;
    const { horario } = passagem;
    const horariosTemp = utils.deepCopy(horarios);

    dispatch(actions.setErroSalvandoIda(false));
    if (horario.length > 0) {
      horariosTemp[horario] = horariosBackup[horario];
      dispatch(actions.setHorarios(horariosTemp));
      dispatch(actions.changePoltrona([]));
      dispatch(actions.changeHorario(''));
      this.enableAllHorarios(true);
    }
  }

  handleLimpaVolta() {
    const { dispatch, passagemVolta, horarios, horariosVolta, horariosVoltaBackup } = this.props;
    const { horario } = passagemVolta;
    const horariosTemp = utils.deepCopy(horariosVolta);

    dispatch(actions.setErroSalvandoVolta(false));
    if (horario.length > 0) {
      horariosTemp[horario] = horariosVoltaBackup[horario];
      dispatch(actions.setHorariosVolta(horariosTemp));
      dispatch(actions.changePoltronaVolta([]));
      dispatch(actions.changeHorarioVolta(''));
      this.enableAllHorarios(false);
    }
  }

  handleClickSeat(isVolta, horario, value, status) {
    const { dispatch, horarios, horariosVolta } = this.props;

    // se a poltrona já está ocupada, não faz nada
    if (status === utils.PoltronaStatus.RESERVED) {
      return;
    }

    const updatedHorarios = utils.deepCopy(isVolta ? horariosVolta : horarios);

    if (status === utils.PoltronaStatus.FREE) {
      updatedHorarios[horario][value] = utils.PoltronaStatus.SELECTED;
    } else if (status === utils.PoltronaStatus.SELECTED) {
      updatedHorarios[horario][value] = utils.PoltronaStatus.FREE;
    }

    !isVolta && dispatch(actions.setHorarios(updatedHorarios));
    isVolta && dispatch(actions.setHorariosVolta(updatedHorarios));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.isFrozen;
  }

  handleResetSeats(isVolta, horario) {
    const { dispatch, horarios, horariosVolta, horariosBackup, horariosVoltaBackup } = this.props;
    const horariosTemp = utils.deepCopy(horarios);
    const horariosVoltaTemp = utils.deepCopy(horariosVolta);
    // const horariosBackupTemp = utils.deepCopy(horariosBackup);
    // const horariosVoltaBackupTemp = utils.deepCopy(horariosVoltaBackup);

    if (isVolta) {
      horariosVoltaTemp[horario] = horariosVoltaBackup[horario];
      dispatch(actions.setHorariosVolta(horariosVoltaTemp));
    } else {
      horariosTemp[horario] = horariosBackup[horario];
      dispatch(actions.setHorarios(horariosTemp));
    }
  }

  checkNotAllowed(isVolta, horarioCompare) {
    const { dispatch, horarios, horariosVolta, passagem, passagemVolta, isIdaVolta } = this.props;
    if (!isIdaVolta || (passagem.data.value !== passagemVolta.data.value)) {
      return;
    }

    const tempHorarios = utils.deepCopy(isVolta ? horariosVolta : horarios);
    if (isVolta) {
      for (const horario in tempHorarios) {
        if (horario <= horarioCompare) {
          tempHorarios[horario].isDisabled = true;
        }
      }
      dispatch(actions.setActiveAccordionVolta(-1));
      dispatch(actions.setHorariosVolta(tempHorarios));
    } else {
      for (const horario in tempHorarios) {
        if (horario >= horarioCompare) {
          tempHorarios[horario].isDisabled = true;
        }
      }
      dispatch(actions.setActiveAccordion(-1));
      dispatch(actions.setHorarios(tempHorarios));
    }
  }

  handleSaveSeats(event, isVolta, horario) {
    event.preventDefault();

    const { dispatch, horarios, horariosVolta, passagem, passagemVolta, isIdaVolta } = this.props;
    const horarioSelected = isVolta ? horariosVolta[horario] : horarios[horario];
    const poltronasSelected = Object.keys(horarioSelected).filter(
      item => horarioSelected[item] === utils.PoltronaStatus.SELECTED
    );

    const snackType = utils.SnackbarTypes.SUCCESS;

    if (poltronasSelected.length > 0) {
      dispatch(actions.setSavingPoltronas(true)); // liga spinning
      setTimeout(() => {
        if (isVolta) {
          dispatch(actions.setErroSalvandoVolta(false));
          dispatch(actions.changeHorarioVolta(horario));
          dispatch(actions.changePoltronaVolta(poltronasSelected));
          dispatch(snackbarActions.show(snackType, 'Poltronas de IDA salvas com sucesso.'));
        } else {
          dispatch(actions.setErroSalvandoIda(false));
          dispatch(actions.changeHorario(horario));
          dispatch(actions.changePoltrona(poltronasSelected));
          dispatch(snackbarActions.show(snackType, 'Poltronas de VOLTA salvas com sucesso.'));
        }

        this.checkNotAllowed(!isVolta, horario);
        dispatch(actions.setSavingPoltronas(false)); // desliga spinning
      }, 1000);
    }
  }

  initLoadingDialog() {
    const { dispatch } = this.props;
    dispatch(loadingActions.setLoadingMessage('Salvando dados...'));
    dispatch(loadingActions.setLoadingIcon('spinner'));
  }

  componentDidMount() {
    this.initLoadingDialog();
  }

  updatePoltronas(origem, destino, data, horario) {
    const { dispatch } = this.props;
    const todasPoltronas = globals.getPoltronas();

    // se não há mais horários de saída no dia,
    // então desabilita as poltronas e retorna
    if (horario.length === 0) {
      const newPoltronas = todasPoltronas.map((poltrona) => {
        return {
          ...poltrona,
          disabled: true,
          status: utils.PoltronaStatus.RESERVED
        };
      });
      dispatch(actions.setPoltronas(newPoltronas));
      dispatch(actions.changePoltrona(''));
      return;
    }

    // monnta o ref para procurar por poltronas
    // já reservadas neste dia
    const dataFormatted = utils.dateToFirebase(data);
    const horarioFormatted = utils.timeToFirebase(horario);
    const saidasRef = `saidas/${origem}/${destino}/${dataFormatted}/${horarioFormatted}/`;

    // percorre as poltronas já reservadas
    firebaseHelper.fetchKeys(saidasRef)
      .then((keys) => { // desabilta as que foram encontradas
        const poltronasLivres = todasPoltronas.map((poltrona, index, arr) => {
          const numeroPoltrona = Number(arr[poltrona.value].label);
          const isDisabled = keys.includes(numeroPoltrona);
          return {
            ...poltrona,
            disabled: isDisabled,
            status: isDisabled ? utils.PoltronaStatus.RESERVED : utils.PoltronaStatus.FREE
          };
        });
        dispatch(actions.setPoltronas(poltronasLivres));
        dispatch(actions.changePoltrona(''));
      })
      .catch(() => { // se não encontrou nada, carrega a lista default
        dispatch(actions.setPoltronas(todasPoltronas));
        dispatch(actions.changePoltrona(''));
      });
  }

  updateHorarios(data, isClear = false) {
    const { dispatch } = this.props;
    const { horario } = this.props.passagem;

    // get current date
    const dtNow = new Date().toLocaleDateString('pt-BR');
    const tmNow = new Date().toLocaleTimeString('pt-BR');
    const now = utils.buildDateObj(dtNow, tmNow);

    // filter only the future HORARIOS
    const newHorarios = globals.horarios.filter((hora) => {
      const curr = utils.buildDateObj(data, hora);
      return curr > now;
    });

    // set HORARIOS
    dispatch(actions.setHorarios(newHorarios));

    // set default values for HORARIO
    let newHorario = '';
    let index = 0;

    if (newHorarios.length > 0) {
      newHorario = newHorarios[0];

      // check if the current HORARIO is present in the new HORARIOS array
      if ((horario.text.length > 0) && (!isClear)) {
        index = newHorarios.indexOf(horario.text);
        if (index >= 0) {
          newHorario = newHorarios[index];
        }
      }

      // update HORARIO values
      dispatch(actions.changeHorario({
        val: index,
        text: newHorario
      }));

    } else {
      // VALIDAR HORARIOS
    }

    return newHorario;
  }

  initializeValues() {
    const { dispatch, cidades } = this.props;
    const newHorario = this.updateHorarios(utils.DateNowBr, true);
    dispatch(actions.changeData(moment().format('DD/MM/YYYY')));
    this.updatePoltronas(cidades[0], cidades[1], utils.DateNowBr, newHorario);
  }

  updateStatusPoltronas(oldValue, newValue) {
    const { dispatch } = this.props;
    const hasSelection = (newValue.length > 0);

    const isNewValueEmpty = (newValue.length === 0);
    const isOldValueEmpty = (oldValue.length === 0);

    const newPoltronas = utils.deepCopy(this.props.poltronas);
    const arrayNew = newValue.split(',');
    const arrayOld = oldValue.split(',');

    if (isNewValueEmpty) {
      if (!isOldValueEmpty) {
        arrayOld.map((item) => {
          newPoltronas[item].status = utils.PoltronaStatus.FREE;
          return item;
        });
      }
    } else {
      if (hasSelection) {
        const diffNewToOld = arrayNew.filter((item) => {
          return !arrayOld.includes(item);
        });

        if (diffNewToOld.length > 0) {
          const index = diffNewToOld[0];
          newPoltronas[index].status = utils.PoltronaStatus.SELECTED; // adiciona
        } else {
          const diffOldToNew = arrayOld.filter((item) => {
            return !arrayNew.includes(item);
          })

          if (diffOldToNew.length > 0) {
            const index = diffOldToNew[0];
            newPoltronas[index].status = utils.PoltronaStatus.FREE; // remove
          }
        }
      }
    }

    dispatch(actions.setPoltronas(newPoltronas));

    return hasSelection;
  }

  handleChangePoltrona(value) {
    const { dispatch, passagem } = this.props;
    const isPristine = passagem.poltrona.isPristine;
    const hasSelection = this.updateStatusPoltronas(passagem.poltrona.value, value);

    // altera poltrona e seta como 'dirty'
    dispatch(actions.changePoltrona(value));
    isPristine && dispatch(actions.setPoltronaDirty());

    // valida poltrona
    this.updatePoltronaValidation(hasSelection);
  }

  updatePoltronaValidation(hasSelection) {
    const { dispatch, passagem } = this.props;
    const oldPoltrona = passagem.poltrona;

    // test required
    if (hasSelection) {
      (oldPoltrona.validation !== utils.ValidationStatus.NONE) &&
        dispatch(actions.setPoltronaValidation(utils.ValidationStatus.NONE, ''));
    } else {
      (oldPoltrona.validation !== utils.ValidationStatus.ERROR) &&
        dispatch(actions.setPoltronaValidation(utils.ValidationStatus.ERROR, 'Escolha ao menos uma poltrona'));
    }
  }

  handleChangeHorario(event) {
    const { dispatch, passagem } = this.props;
    const { origem, destino, data } = passagem;
    const novoHorarioText = event.target[event.target.value].text;

    dispatch(actions.changeHorario({
      val: event.target.value,
      text: novoHorarioText
    }));

    this.updatePoltronas(origem.text, destino.text, data, novoHorarioText);
  }

  formCanBeSaved() {
    const { dispatch, passagem, passagemVolta, isIdaVolta } = this.props;
    const snackType = utils.SnackbarTypes.ERROR;

    if (isIdaVolta) {
      if ((passagem.horario.length === 0) && (passagemVolta.horario.length === 0)) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(actions.setErroSalvandoVolta(true));
        dispatch(snackbarActions.show(snackType, 'Voce precisa escolher uma poltrona!'));
        return false
      }
      if (passagem.horario.length === 0) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(snackbarActions.show(snackType, 'Voce precisa escolher uma poltrona para a ida!'));
        return false
      }
      if (passagemVolta.horario.length === 0) {
        dispatch(actions.setErroSalvandoVolta(true));
        dispatch(snackbarActions.show(snackType, 'Voce precisa escolher uma poltrona para a volta!'));
        return false
      }
    } else {
      if (passagem.horario.length === 0) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(snackbarActions.show(snackType, 'Voce precisa escolher uma poltrona!'));
        return false
      }
    }

    return true;
  }

  mapPassagemToFirebase(passagem) {
    const { cidades } = this.props;

    return {
      ...passagem,
      nome: firebaseHelper.getUserName(),
      cpf: firebaseHelper.getUserCpf(),
      email: firebaseHelper.getUserEmail(),
      origem: cidades[passagem.origem.value].label,
      destino: cidades[passagem.destino.value].label,
      horario: utils.firebaseToTime(passagem.horario),
      dataCompra: utils.DateNowBr,
      data: passagem.data.value,
      poltrona: (() => {
        passagem.poltrona.sort();
        return passagem.poltrona.join(' - ')
      })()
    };
  }

  poltronaToFirebase(poltrona) {
    return new Promise((resolve) => {
      const todasPoltronas = globals.getPoltronas();
      const array = poltrona.split(',');
      const padArray = array.map(item => (todasPoltronas[item].label).padStart(2, '0'));
      padArray.sort();
      const padString = padArray.join();
      const formatted = padString.replace(/,/g, ' - ');
      resolve(formatted);
    });
  }


  savePassagem(passagem) {
    return new Promise((resolve, reject) => {
      const novaPassagem = this.mapPassagemToFirebase(passagem);
      const { nome, email, cpf, origem, destino, data, horario, dataCompra } = novaPassagem;
      const firebaseDate = utils.dateToFirebase(data);
      const firebaseHorario = passagem.horario;
      const firebaseEmail = utils.emailToFirebaseKey(email);
      const newPassgemRef = `passagens/${firebaseEmail}`;
      const poltronasSelecionadas = passagem.poltrona;

      // salva passagem numa lista global
      firebaseHelper.save(novaPassagem, newPassgemRef)
        .then((key) => {
          const refHorario = `saidas/${origem}/${destino}/${firebaseDate}/${firebaseHorario}/`;

          // muda o status do ônibus para ocupado
          firebaseHelper.set(utils.BusStatus.OCUPADO, `${refHorario}status`);

          // percorre as poltronas selecionada e salva uma por uma
          poltronasSelecionadas.forEach((val, index, arr) => {
            const refPoltrona = `${refHorario}/${val}/`;
            firebaseHelper.set({ user: email }, refPoltrona)
              .then(() => {
                if (index === (arr.length - 1)) {
                  resolve({ novaPassagem, key });
                }
              });
          });
        });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, passagem, passagemVolta, isIdaVolta, history } = this.props;

    dispatch(loadingActions.setStatus(utils.SavingStatus.SAVING));

    if (this.formCanBeSaved()) {
      this.savePassagem(passagem)
        .then((objIda) => {
          if (isIdaVolta) {
            this.savePassagem(passagemVolta)
              .then((objVolta) => {
                setTimeout(() => {
                  dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
                  console.log('ida e volta salvos com sucesso!');
                  // history.push({
                  //   pathname: `/passagem/${objIda.key}`,
                  //   state: {
                  //     novaPassagemIda: objIda.novaPassagem,
                  //     novaPassagemVolta: objVolta.novaPassagem,
                  //     keyIda: objIda.key,
                  //     keyVolta: objVolta.key
                  //   }
                  // });
                }, 1000);
              });
          } else {
            setTimeout(() => {
              dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
              console.log('ida salva com sucesso!');
              // history.push({
              //   pathname: `/passagem/${objIda.key}`,
              //   state: {
              //     novaPassagem: objIda.novaPassagem,
              //     key: objIda.key
              //   }
              // });
            }, 1000);
          }
        })
        .catch((error) => {
          dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
        });
    } else {
      dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
    }
  }

  handleReset(event) {
    event.preventDefault();
    this.reset();
  }

  reset() {
    const { dispatch } = this.props;
    dispatch(actions.resetFormPassagem());
    this.initializeValues();
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    const { horarios, horariosVolta, cidades, passagem, passagemVolta,
      isIdaVolta, activeAccordion, activeAccordionVolta, activeTab,
      isSavingPoltronas, hasErroSalvandoIda, hasErroSalvandoVolta } = this.props;
    const momentIda = moment(passagem.data.value, 'DD/MM/YYYY');
    const strDataIda = momentIda.format('DD/MM/YYYY');
    const momentVolta = moment(passagemVolta.data.value, 'DD/MM/YYYY');
    const strDataVolta = momentVolta.format('DD/MM/YYYY');
    const strOrigem = cidades[passagem.origem.value].label;
    const strDestino = cidades[passagem.destino.value].label;
    const NoResultsAccordionIda = withNoResults(HorariosAccordion, horarios);
    const NoResultsAccordionVolta = withNoResults(HorariosAccordion, horariosVolta);

    const confirmacaoPanelProps = {
      isIdaVolta,
      hasErroSalvandoIda,
      hasErroSalvandoVolta,
      origem: strOrigem,
      destino: strDestino,
      dataIda: strDataIda,
      dataVolta: strDataVolta,
      horarioIda: passagem.horario,
      horarioVolta: passagemVolta.horario,
      poltronasIda: passagem.poltrona,
      poltronasVolta: passagemVolta.poltrona,
      onChangeTrajeto: this.handleChangeTrajeto,
      onLimpaIda: this.handleLimpaIda,
      onLimpaVolta: this.handleLimpaVolta,
      onContinua: this.handleSubmit
    }

    return (
      <div className="comprar-passagem-container">
        <PageHeader
          title="Compre sua passagem"
          className="header-comprar">
        </PageHeader>
        <div className="form-passagem-container">
          <DivAnimated className="form-centered">
            <div className="horarios-container">
              <ConfirmacaoPanel props={confirmacaoPanelProps} />
              <Tabs
                defaultActiveKey={1}
                activeKey={isIdaVolta ? activeTab : 1}
                id="tab-horarios"
                className={isIdaVolta ? "tab-control" : "tab-control-only-ida"}
                animation={false}
                onSelect={this.handleSelectTab}>
                <Tab
                  eventKey={1}
                  title={
                    <span className="tab-left">
                      <img src={idaLogo} alt="" className="icon-ida" />
                      <span className="title-after-icon">{strDataIda}</span>
                    </span>
                  }>
                  <NoResultsAccordionIda
                    className="accordion-ida"
                    color="dark"
                    isVolta={false}
                    isSavingPoltronas={isSavingPoltronas}
                    horarios={horarios}
                    active={activeAccordion}
                    onClickSeat={this.handleClickSeat}
                    onResetSeats={this.handleResetSeats}
                    onSaveSeats={this.handleSaveSeats}
                  />
                </Tab>
                {
                  isIdaVolta &&
                  <Tab
                    eventKey={2}
                    className="tab-volta"
                    title={
                      <span className="tab-left">
                        <img
                          src={voltaLogo}
                          alt=""
                          className="icon-volta"
                        />
                        <span className="title-after-icon">{strDataVolta}</span>
                      </span>
                    }>
                    <NoResultsAccordionVolta
                      className="accordion-volta"
                      color="dark"
                      isVolta={true}
                      isSavingPoltronas={isSavingPoltronas}
                      horarios={horariosVolta}
                      active={activeAccordionVolta}
                      onClickSeat={this.handleClickSeat}
                      onResetSeats={this.handleResetSeats}
                      onSaveSeats={this.handleSaveSeats}
                    />
                  </Tab>
                }
              </Tabs>
            </div>
          </DivAnimated>
        </div>
        <Snackbar />
      </div >
    );
  }
}


const mapStateToProps = (state) => {
  return {
    cidades: state.compraPassagemState.cidades,
    horarios: state.compraPassagemState.horarios,
    horariosVolta: state.compraPassagemState.horariosVolta,
    horariosBackup: state.compraPassagemState.horariosBackup,
    horariosVoltaBackup: state.compraPassagemState.horariosVoltaBackup,
    poltronas: state.compraPassagemState.poltronas,
    passagem: state.compraPassagemState.passagem,
    passagemVolta: state.compraPassagemState.passagemVolta,
    isIdaVolta: state.compraPassagemState.isIdaVolta,
    isFrozen: state.compraPassagemState.isFrozen,
    isSavingPoltronas: state.compraPassagemState.isSavingPoltronas,
    activeAccordion: state.compraPassagemState.activeAccordion,
    activeAccordionVolta: state.compraPassagemState.activeAccordionVolta,
    activeTab: state.compraPassagemState.activeTab,
    hasErroSalvandoIda: state.compraPassagemState.hasErroSalvandoIda,
    hasErroSalvandoVolta: state.compraPassagemState.hasErroSalvandoVolta,
    // snackbar: state.compraPassagemState.snackbar,
    snapshot: state.compraPassagemState,
    snackbar: {
      visible: state.snackbarState.visible,
      message: state.snackbarState.message,
      type: state.snackbarState.type
    }
  };
};

const CompraPassagemWithRouter = withRouter(CompraPassagem);
const CompraPassagemWithRouterAndAuth = withAuth(CompraPassagemWithRouter);
export default connect(mapStateToProps)(CompraPassagemWithRouterAndAuth);