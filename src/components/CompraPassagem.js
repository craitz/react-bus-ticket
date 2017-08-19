import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment';
import Button from 'react-toolbox/lib/button/Button';
import Tab from 'react-toolbox/lib/tabs/Tab';
import Tabs from 'react-toolbox/lib/tabs/Tabs';
import MenuItem from 'react-toolbox/lib/menu/MenuItem';
import IconMenu from 'react-toolbox/lib/menu/IconMenu';
import { Jumbotron, Row } from 'react-bootstrap';
import { globals } from '../shared/Globals';
import { withAuth, withNoResults } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import { PageHeader } from '../shared/PageHeader';
import DivAnimated from '../shared/DivAnimated'
import Snackbar from '../shared/Snackbar';
import ProgressBar from 'react-toolbox/lib/progress_bar/ProgressBar';
import TooltipOverlay from '../shared/TooltipOverlay';
import SpinnerButton from "../shared/SpinnerButton";
import * as utils from '../shared/Utils';
import * as actions from '../actions/compraPassagem.actions';
import * as modalTrajetoActions from '../actions/modalTrajeto.actions'
import * as snackbarActions from '../actions/snackbar.actions'
import HorariosAccordion from './HorariosAccordion';

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
    this.handleClickSeat = this.handleClickSeat.bind(this);
    this.handleResetSeats = this.handleResetSeats.bind(this);
    this.handleSaveSeats = this.handleSaveSeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTrajeto = this.handleChangeTrajeto.bind(this);
    this.handleLimpaIda = this.handleLimpaIda.bind(this);
    this.handleLimpaVolta = this.handleLimpaVolta.bind(this);
    this.handleSelectTab = this.handleSelectTab.bind(this);
    this.handleExcluiVolta = this.handleExcluiVolta.bind(this);
    this.state = {
      salvando: false
    };
  }

  initializeValues() {
    const { dispatch, cidades } = this.props;
    const newHorario = this.updateHorarios(utils.DateNowBr, true);
    dispatch(actions.changeData(moment().format('DD/MM/YYYY')));
    this.updatePoltronas(cidades[0], cidades[1], utils.DateNowBr, newHorario);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.isFrozen;
  }

  handleExcluiVolta() {
    this.props.dispatch(actions.setIdaVolta(false));
    this.props.dispatch(actions.setActiveTab(0));
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

    if (poltronasSelected.length > 0) {
      dispatch(actions.setSavingPoltronas(true)); // liga spinning
      setTimeout(() => {
        if (isVolta) {
          dispatch(actions.setErroSalvandoVolta(false));
          dispatch(actions.changeHorarioVolta(horario));
          dispatch(actions.changePoltronaVolta(poltronasSelected));
        } else {
          dispatch(actions.setErroSalvandoIda(false));
          dispatch(actions.changeHorario(horario));
          dispatch(actions.changePoltrona(poltronasSelected));
        }

        this.checkNotAllowed(!isVolta, horario);
        dispatch(actions.setSavingPoltronas(false)); // desliga spinning
      }, 2000);
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

  formCanBeSaved() {
    const { dispatch, passagem, passagemVolta, isIdaVolta } = this.props;
    const snackType = utils.SnackbarTypes.ERROR;

    if (isIdaVolta) {
      if ((passagem.horario.length === 0) && (passagemVolta.horario.length === 0)) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(actions.setErroSalvandoVolta(true));
        dispatch(snackbarActions.show(snackType, 'Nenhuma poltrona reservada !'));
        return false
      }
      if (passagem.horario.length === 0) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(snackbarActions.show(snackType, 'Nenhuma poltrona reservada na ida !'));
        return false
      }
      if (passagemVolta.horario.length === 0) {
        dispatch(actions.setErroSalvandoVolta(true));
        dispatch(snackbarActions.show(snackType, 'Nenhuma poltrona reservada na volta !'));
        return false
      }
    } else {
      if (passagem.horario.length === 0) {
        dispatch(actions.setErroSalvandoIda(true));
        dispatch(snackbarActions.show(snackType, 'Nenhuma poltrona reservada !'));
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
    const { passagem, passagemVolta, isIdaVolta, history } = this.props;

    const showSpinner = () =>
      this.setState({
        salvando: true
      });

    const hideSpinner = () =>
      this.setState({
        salvando: false
      });


    showSpinner();

    if (this.formCanBeSaved()) {
      this.savePassagem(passagem)
        .then((objIda) => {
          if (isIdaVolta) {
            this.savePassagem(passagemVolta)
              .then((objVolta) => {
                setTimeout(() => {
                  hideSpinner();
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
              hideSpinner();
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
          hideSpinner();
        });
    } else {
      hideSpinner();
    }
  }

  render() {
    const { horarios, horariosVolta, cidades, passagem, passagemVolta,
      isIdaVolta, activeAccordion, activeAccordionVolta, activeTab,
      isSavingPoltronas } = this.props;
    const loading = this.state.salvando;
    const loadingClass = loading ? "comprar-passagem-container loading" : "comprar-passagem-container";
    const containerClass = isSavingPoltronas ? `${loadingClass} saving` : loadingClass;
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
      const poltronasFormatted = strPoltronas.length > 0 ? utils.sortPoltronas(strPoltronas) : '';

      const trajetoIda = (
        <Jumbotron className="jumbo-info ida">
          <div className="tab-row">
            <i className="material-icons">my_location</i>
            <span>{isVolta ? strDestino : strOrigem}</span>
          </div>
          <div className="tab-row">
            <i className="material-icons">place</i>
            <span>{isVolta ? strOrigem : strDestino}</span>
          </div>
          <div className="tab-row">
            <i className="material-icons">today</i>
            <span>{isVolta ? strDataVolta : strDataIda}</span>
          </div>
          <div className="tab-row">
            <i className="material-icons">alarm</i>
            <span>{horarioFormatted}</span>
          </div>
          <div className="tab-row">
            <i className="material-icons">airline_seat_recline_extra</i>
            <span>{poltronasFormatted}</span>
          </div>
          <IconMenu
            icon="more_vert"
            position="topRight"
            menuRipple
            className="menu-ida"
          >
            <MenuItem
              value='limpar-poltronas'
              icon="delete"
              caption="Limpar poltronas"
              onClick={this.handleLimpaIda}
            />
          </IconMenu>
        </Jumbotron>
      );

      const trajetoVolta = (
        <Jumbotron className="jumbo-info volta">
          <div className="tab-row">
            <span>{isVolta ? strDestino : strOrigem}</span>
            <i className="material-icons">place</i>
          </div>
          <div className="tab-row">
            <span>{isVolta ? strOrigem : strDestino}</span>
            <i className="material-icons">my_location</i>
          </div>
          <div className="tab-row">
            <span>{isVolta ? strDataVolta : strDataIda}</span>
            <i className="material-icons">event</i>
          </div>
          <div className="tab-row">
            <span>{horarioFormatted}</span>
            <i className="material-icons">alarm</i>
          </div>
          <div className="tab-row">
            <span>{poltronasFormatted}</span>
            <i className="material-icons">airline_seat_recline_extra</i>
          </div>
          <IconMenu
            icon="more_vert"
            position="topLeft"
            menuRipple
            className="menu-volta"
          >
            <MenuItem
              value='limpar-poltronas'
              icon="delete"
              caption="Limpar poltronas"
              onClick={this.handleLimpaVolta}
            />
            <MenuItem
              value='excluir-volta'
              icon="event_busy"
              caption='Excluir volta'
              onClick={this.handleExcluiVolta}
            />

          </IconMenu>
        </Jumbotron>
      );

      return (
        <section className="text-left">
          {!isVolta && trajetoIda}
          {isVolta && trajetoVolta}
        </section>
      );
    }

    const ButtonFinalizar = () =>
      <Button
        floating
        accent
        className="button-finaliza mui--z2"
        onClick={this.handleSubmit}
        icon="check"
        disabled={loading}
      />

    const ButtonEditar = () =>
      <TooltipOverlay text="Alterar passagem" position="top">
        <Button
          floating
          primary
          className="button-editar mui--z2"
          onClick={this.handleChangeTrajeto}
          icon="mode_edit"
        />
      </TooltipOverlay>

    const ButtonSection = () => {
      const getFooterLabel = () => {
        if (loading) {
          return "Finalizando operação...";
        } else {
          return "Finalizar compra"
        }
      };

      return (
        <Row className="footer-section">
          {loading && <ProgressBar className="footer-progress" mode="indeterminate" />}
          <span>{getFooterLabel()}</span>
          {/*<span className="visible-xs">Finalizar</span>*/}
          <ButtonFinalizar />
        </Row>
      );
    }

    const InfoPassagem = ({ isVolta }) =>
      <HeaderTab isVolta={isVolta} />

    const TabsLarge = () =>
      <Tabs
        index={isIdaVolta ? activeTab : 0}
        fixed
        inverse
        onChange={this.handleSelectTab}
        className="tab-horarios mui--z2 hidden-xs"
      >
        <Tab label="IDA" className="tab-ida">
          <InfoPassagem isVolta={false} />
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
          <ButtonSection />
        </Tab>
        {isIdaVolta &&
          <Tab label="VOLTA" className="tab-volta">
            <InfoPassagem isVolta={true} />
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
            <ButtonSection />
          </Tab>
        }
      </Tabs>

    const TabsMini = () =>
      <Tabs
        index={isIdaVolta ? activeTab : 0}
        fixed
        inverse
        onChange={this.handleSelectTab}
        className="tab-horarios tab-xs mui--z2 visible-xs"
      >
        <Tab
          label="IDA"
          className="tab-ida-mini"
        >
          <InfoPassagem isVolta={false} />
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
          <ButtonSection />
        </Tab>
        {isIdaVolta &&
          <Tab
            label="VOLTA"
            className="tab-volta-mini"
          >
            <InfoPassagem isVolta={true} />
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
            <ButtonSection />
          </Tab>
        }
      </Tabs>

    return (
      <div className={containerClass}>
        {/*<PageHeader
          title="Compre sua passagem"
          className="header-comprar hidden-xs"
        >
          <ButtonEditar />
        </PageHeader>*/}
        <PageHeader
          title="Comprar passagens"
          className="header-comprar"
        >
          <ButtonEditar />
        </PageHeader>
        <div className="form-passagem-container">
          <DivAnimated className="form-centered">
            <div className="horarios-container">
              <TabsLarge />
              <TabsMini />
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
    snapshot: state.compraPassagemState,
  };
};

const CompraPassagemWithRouter = withRouter(CompraPassagem);
const CompraPassagemWithRouterAndAuth = withAuth(CompraPassagemWithRouter);
export default connect(mapStateToProps)(CompraPassagemWithRouterAndAuth);