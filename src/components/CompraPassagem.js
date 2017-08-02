import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { withAuth } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
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
import Button from 'react-toolbox/lib/button/Button';
import Tab from 'react-toolbox/lib/tabs/Tab';
import Tabs from 'react-toolbox/lib/tabs/Tabs';
import Snackbar from '../shared/Snackbar';

const sortPoltronas = (poltronas) => {
  const poltronasTemp = utils.deepCopy(poltronas);
  poltronasTemp.sort();
  return poltronasTemp.join(' | ');
}

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
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
    this.handleChangeOrigem = this.handleChangeOrigem.bind(this);
    this.handleChangeDestino = this.handleChangeDestino.bind(this);
  }

  initializeValues() {
    const { dispatch, cidades } = this.props;
    const newHorario = this.updateHorarios(utils.DateNowBr, true);
    dispatch(actions.changeData(moment().format('DD/MM/YYYY')));
    this.updatePoltronas(cidades[0], cidades[1], utils.DateNowBr, newHorario);
  }

  initLoadingDialog() {
    const { dispatch } = this.props;
    dispatch(loadingActions.setLoadingMessage('Salvando dados...'));
    dispatch(loadingActions.setLoadingIcon('spinner'));
  }

  componentDidMount() {
    this.initLoadingDialog();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.isFrozen;
  }

  handleChangeOrigem(value) {
    // Se limpou o input origem, cancela o evento e retorna sem fazer nada
    // Ou seja, o input nunca pode ficar vazio
    if (!value || value.length === 0) {
      return;
    }

    const { dispatch, passagem } = this.props;
    const isPristine = passagem.origem.isPristine;
    dispatch(actions.changeOrigem(value)); // muda a origem
    isPristine && dispatch(actions.setOrigemDirty()); // seta dirty

    // Se a origem é a mesma do destino, muda o destino
    const origemVal = parseInt(value, 10);
    const destinoVal = parseInt(passagem.destino.value, 10);
    if (origemVal === destinoVal) {
      const newIndexDestino = (destinoVal === 0) ? (destinoVal + 1) : (destinoVal - 1);
      dispatch(actions.changeDestino(newIndexDestino.toString()));
    };
  }

  handleChangeDestino(value) {
    // Se limpou o input destino, cancela o evento e retorna sem fazer nada
    // Ou seja, o input nunca pode ficar vazio
    if (!value || value.length === 0) {
      return;
    }

    const { dispatch, passagem } = this.props;
    const isPristine = passagem.destino.isPristine;
    dispatch(actions.changeDestino(value)); // muda o destino
    isPristine && dispatch(actions.setDestinoDirty()); // seta dirty

    // Se o destino é o mesmo da origem, muda a origem
    const origemVal = parseInt(passagem.origem.value, 10);
    const destinoVal = parseInt(value, 10);
    if (origemVal === destinoVal) {
      const newIndexOrigem = (origemVal === 0) ? (origemVal + 1) : (origemVal - 1);
      dispatch(actions.changeOrigem(newIndexOrigem.toString()));
    };
  }

  handleSelectTab(event) {
    this.props.dispatch(actions.setActiveTab(event));
  }

  handleChangeTrajeto(event) {
    const { dispatch, snapshot } = this.props;
    dispatch(actions.SetFrozen(true));
    dispatch(modalTrajetoActions.setVisible(true, false, snapshot));
  }

  enableAllHorarios(isVolta) {
    const { dispatch, horarios, horariosVolta, passagem, passagemVolta } = this.props;

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
    const { dispatch, passagem, horarios, horariosBackup } = this.props;
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
    const { dispatch, passagemVolta, horariosVolta, horariosVoltaBackup } = this.props;
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

  handleResetSeats(isVolta, horario) {
    const { dispatch, horarios, horariosVolta, horariosBackup, horariosVoltaBackup } = this.props;
    const horariosTemp = utils.deepCopy(horarios);
    const horariosVoltaTemp = utils.deepCopy(horariosVolta);

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

    const { dispatch, horarios, horariosVolta } = this.props;
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
          dispatch(snackbarActions.show(snackType, 'Poltronas de VOLTA salvas com sucesso.'));
        } else {
          dispatch(actions.setErroSalvandoIda(false));
          dispatch(actions.changeHorario(horario));
          dispatch(actions.changePoltrona(poltronasSelected));
          dispatch(snackbarActions.show(snackType, 'Poltronas de IDA salvas com sucesso.'));
        }

        this.checkNotAllowed(!isVolta, horario);
        dispatch(actions.setSavingPoltronas(false)); // desliga spinning
      }, 1000);
    }
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
      const { email, origem, destino, data } = novaPassagem;
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
                  history.push({
                    pathname: `/passagem/${objIda.key}`,
                    state: {
                      novaPassagem: objIda.novaPassagem,
                      novaPassagemVolta: objVolta.novaPassagem,
                      key: objIda.key,
                      keyVolta: objVolta.key,
                      isIdaVolta
                    }
                  });
                }, 1000);
              });
          } else {
            setTimeout(() => {
              dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
              console.log('ida salva com sucesso!');
              history.push({
                pathname: `/passagem/${objIda.key}`,
                state: {
                  novaPassagem: objIda.novaPassagem,
                  key: objIda.key,
                  isIdaVolta
                }
              });
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
      isSavingPoltronas } = this.props;
    const momentIda = moment(passagem.data.value, 'DD/MM/YYYY');
    const strDataIda = momentIda.format('DD/MM/YYYY');
    const momentVolta = moment(passagemVolta.data.value, 'DD/MM/YYYY');
    const strDataVolta = momentVolta.format('DD/MM/YYYY');
    const strOrigem = cidades[passagem.origem.value].label;
    const strDestino = cidades[passagem.destino.value].label;
    const NoResultsAccordionIda = withNoResults(HorariosAccordion, horarios);
    const NoResultsAccordionVolta = withNoResults(HorariosAccordion, horariosVolta);

    const HeaderTab = ({ isVolta }) => {

      const strHorario = isVolta ? passagemVolta.horario : passagem.horario;
      const horarioFormatted = strHorario.length > 0 ? utils.firebaseToTime(strHorario) : '';

      const strPoltronas = isVolta ? passagemVolta.poltrona : passagem.poltrona;
      const poltronasFormatted = strPoltronas.length > 0 ? sortPoltronas(strPoltronas) : '';

      const trajetoIda = (
        <section className="text-right">
          <section className="tab-row">
            <span>{isVolta ? strDestino : strOrigem}</span>
            <FontAwesome name="location-arrow fa-fw" className="text-after-icon" />
          </section>
          <section className="tab-row">
            <span>{isVolta ? strOrigem : strDestino}</span>
            <FontAwesome name="map-marker fa-fw" className="text-after-icon" />
          </section>
          <section className="tab-row">
            <span>{isVolta ? strDataVolta : strDataIda}</span>
            <FontAwesome name="calendar fa-fw" className="text-after-icon" />
          </section>
          <section className="tab-row">
            <span>{horarioFormatted}</span>
            <FontAwesome name="clock-o fa-fw" className="text-after-icon" />
          </section>
          <section className="tab-row">
            <span>{poltronasFormatted}</span>
            <FontAwesome name="bookmark fa-fw" className="text-after-icon" />
          </section>
        </section>
      );

      const trajetoVolta = (
        <section>
          <section className="tab-row">
            <FontAwesome name="location-arrow fa-fw" />
            <span className="text-after-icon">{isVolta ? strDestino : strOrigem}</span>
            {/*<FontAwesome name="long-arrow-right" className="text-after-icon" />*/}
          </section>
          <section className="tab-row">
            <FontAwesome name="map-marker fa-fw" />
            <span className="text-after-icon">{isVolta ? strOrigem : strDestino}</span>
          </section>
          <section className="tab-row">
            <FontAwesome name="calendar fa-fw" />
            <span className="text-after-icon">{isVolta ? strDataVolta : strDataIda}</span>
          </section>
          <section className="tab-row">
            <FontAwesome name="clock-o fa-fw" />
            <span className="text-after-icon">{horarioFormatted}</span>
          </section>
          <section className="tab-row">
            <FontAwesome name="bookmark fa-fw" />
            <span className="text-after-icon">{poltronasFormatted}</span>
          </section>
        </section>
      );

      return (
        <section className="text-left">
          {!isVolta && trajetoIda}
          {isVolta && trajetoVolta}
        </section>
      );
    }

    const ButtonFinalizar = () =>
      <TooltipOverlay text="Finalizar compra" position="top">
        <Button
          floating
          accent
          className="button-finaliza mui--z2"
          onClick={this.handleSubmit}
          icon={<FontAwesome name="check" />}
        />
      </TooltipOverlay>

    const ButtonEditar = () =>
      <TooltipOverlay text="Alterar passagem" position="top">
        <Button
          floating
          primary
          mini
          className="button-edit mui--z2"
          onClick={this.handleChangeTrajeto}
          icon={<FontAwesome name="edit" />}
        />
      </TooltipOverlay>

    const ButtonLimpar = ({ isVolta }) =>
      <TooltipOverlay text="Limpar dados" position="top">
        <Button
          floating
          accent
          mini
          className={isVolta ? "button-limpar-volta mui--z2" : "button-limpar-ida mui--z2"}
          onClick={isVolta ? this.handleLimpaVolta : this.handleLimpaIda}
          icon={<FontAwesome name="times" />}
        />
      </TooltipOverlay>

    const TabsLarge = () =>
      <Tabs
        index={isIdaVolta ? activeTab : 0}
        fixed
        inverse
        onChange={this.handleSelectTab}
        className="tab-horarios mui--z3 hidden-xs"
      >
        <Tab
          label={<HeaderTab isVolta={false} />}
          className="tab-ida"
        >
          {/*<section className="floating-ida"></section>*/}
          <ButtonLimpar isVolta={false}/>
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
        {isIdaVolta &&
          <Tab
            label={<HeaderTab isVolta={true} />}
            className="tab-volta"
          >
            {/*<section className="floating-volta"></section>*/}
          <ButtonLimpar isVolta={true}/>
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

    const TabsMini = () =>
      <section className="hidden-sm hidden-md hidden-lg">
        <Tabs
          index={0}
          fixed
          inverse
          className="tab-horarios mini-ida mui--z3"
        >
          <Tab
            label={<HeaderTab isVolta={false} />}
            className="tab-ida-mini"
          >
            <ButtonLimpar isVolta={false}/>
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
        </Tabs>
        {
          isIdaVolta &&
          <Tabs
            index={0}
            fixed
            inverse
            className="tab-horarios mini-volta mui--z3"
          >
            <Tab
              label={<HeaderTab isVolta={true} />}
              className="tab-volta-mini"
            >
            <ButtonLimpar isVolta={true}/>
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
          </Tabs>   
        }    
     </section>
    
    return (
      <div className="comprar-passagem-container">
        <PageHeader
          title="Compre sua passagem"
          className="header-comprar hidden-xs"
        >
          <ButtonFinalizar />
          <ButtonEditar />
        </PageHeader>
        <PageHeader
          title="Compre já!"
          className="header-comprar hidden-sm hidden-md hidden-lg"
        >
          <ButtonFinalizar />
          <ButtonEditar />
        </PageHeader>
        <div className="form-passagem-container">
          <DivAnimated className="form-centered">
            <div className="horarios-container">
              <TabsLarge/>
              <TabsMini/>
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