import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { BaseField, withSelect, withDate, withMultiSelect } from '../shared/FormFields';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { withAuth } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import { Row, Col, Jumbotron, Navbar, Nav, NavItem, Collapse, Label, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated'
import moment from 'moment';
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import * as loadingActions from '../actions/loadingDialog.actions'
import * as modalTrajetoActions from '../actions/modalTrajeto.actions'
import { ButtonIcon, ButtonIconFit } from '../shared/ButtonIcon';
import Collapsible from 'react-collapsible';
import Accordion from 'react-responsive-accordion';

const SelectField = withSelect(BaseField);
const MultiSelectField = withMultiSelect(BaseField);
const DateField = withDate(BaseField);

const helper = {
  mapPassagemToFirebase(passagem) {
    return {
      ...passagem,
      nome: firebaseHelper.getUserName(),
      cpf: firebaseHelper.getUserCpf(),
      email: firebaseHelper.getUserEmail(),
      origem: passagem.origem.text,
      destino: passagem.destino.text,
      horario: passagem.horario.text,
      poltrona: passagem.poltrona.value,
      dataCompra: utils.DateNowBr
    };
  },
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
};

const ConditionalAccordion = ({ className, array, color, icon }) => {
  // retorna todos os horarios de determnada data
  const getHorarios = () => {
    if (!array) { return null }
    const newArray = Object.keys(array);
    return newArray.sort().map(item => utils.firebaseToTime(item));
  }

  // retorna as poltronas reservadas de determinado horário
  const getPoltronas = (array, hora) => {
    const ocupadasArray = Object.keys(array[hora]);
    return [...Array(44).keys()].map(item => {
      const strValue = (++item).toString().padStart(2, '0');
      return {
        value: strValue,
        status: ocupadasArray.includes(strValue)
          ? utils.PoltronaStatus.RESERVED
          : utils.PoltronaStatus.FREE
      }
    });
  }

  // monta o class
  const setTriggerClass = () => `btn-google-${color} btn-block collapse-trigger-button`;

  // pega os horarios do dia
  const arrHorarios = getHorarios();

  // se não houver horários, não renderiza nada
  if (!arrHorarios) {
    return null;
  }

  return (
    <Accordion
      startPosition={-1}
      transitionTime={300}
      classParentString={className}>
      {arrHorarios.map((item, index) =>
        <div
          key={index}
          data-trigger={
            <Button type="button" className={setTriggerClass()}>
              <FontAwesome name={icon} className="pull-left icon" />
              {(item.length > 0) && <span className="text-after-icon pull-right">{item}</span>}
              <FontAwesome name="clock-o" className="pull-right icon" />
            </Button>
          }>
          <BusSeatsSelect seats={getPoltronas(array, utils.timeToFirebase(item))} onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
        </div>
      )}
    </Accordion>

  );
}

const Seat = ({ children, className, onClickSeat, value }) => {
  return (
    <Label bsSize="xsmall" bsStyle="default" className={className} onClick={() => onClickSeat(value)}>{children}</Label>
  );
}

const BusRow = ({ rowClass, seats, onClickSeat, row }) => {
  const getValue = index => seats[index].value;
  const getStatus = index => seats[index].status;

  return (
    <Row className={rowClass}>
      {row.map((item, index) =>
        <Seat
          key={index}
          bsStyle="default"
          className={getStatus(item)}
          onClickSeat={onClickSeat}
          value={getValue(item)}>
          {getValue(item)}
        </Seat>)}
    </Row>

  );
}

const BusSeatsSelect = ({ seats, onClickSeat, onResetSeats }) => {
  console.log(seats);
  return (
    <div className="bus-seat-select">
      <Jumbotron>
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42]}>
        </BusRow>
        <BusRow
          rowClass="bus-row corredor-acima"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43]}>
        </BusRow>
        <BusRow
          rowClass="bus-row corredor-abaixo"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41]}>
        </BusRow>
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]}>
        </BusRow>
      </Jumbotron>
    </div >
  );
};

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
    this.handleReset = this.handleReset.bind(this);
    this.handleChangePoltrona = this.handleChangePoltrona.bind(this);
    this.handleChangeHorario = this.handleChangeHorario.bind(this);
    this.handleClickSeat = this.handleClickSeat.bind(this);
    this.handleResetSeats = this.handleResetSeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
    this.handleClickIdaVolta = this.handleClickIdaVolta.bind(this);
    this.handleChangeTrajeto = this.handleChangeTrajeto.bind(this);
  }

  addPoltronaToSelect(current, value) {
    return (current.length === 0) ? value.toString() : `${current},${value}`;
  }

  removePoltronaFromSelect(current, value) {
    const count = current.match(',');
    const maisDeUma = count && (count.length > 0);

    if (maisDeUma) {
      const array = current.split(',');
      const index = array.findIndex((item) => {
        return item.toString() === value.toString();
      });
      if (index >= 0) {
        array.splice(index, 1);
      }

      return array.join();
    } else {
      return '';
    }
  }

  handleClickIdaVolta() {
    const { dispatch, isIdaVolta } = this.props;
    dispatch(actions.setIdaVolta(!isIdaVolta));
  }

  handleChangeTrajeto(event) {
    event.preventDefault();
    const { dispatch, snapshot } = this.props;
    dispatch(actions.SetFrozen(true));
    dispatch(modalTrajetoActions.setVisible(true, false, snapshot));
  }

  handleClickSeat(seat) {
    const { dispatch, poltronas, passagem } = this.props;

    // se a poltrona já está ocupada, não faz nada
    if (poltronas[seat].status === utils.PoltronaStatus.RESERVED) {
      return;
    }

    const isPristine = passagem.poltrona.isPristine;
    const newPoltronas = utils.deepCopy(poltronas);
    const currentValue = passagem.poltrona.value;
    let newPoltronaVal = '';

    if (newPoltronas[seat].status === utils.PoltronaStatus.FREE) {
      newPoltronas[seat].status = utils.PoltronaStatus.SELECTED;
      newPoltronaVal = this.addPoltronaToSelect(currentValue, seat);
    } else if (newPoltronas[seat].status === utils.PoltronaStatus.SELECTED) {
      newPoltronas[seat].status = utils.PoltronaStatus.FREE;
      newPoltronaVal = this.removePoltronaFromSelect(currentValue, seat);
    }

    dispatch(actions.setPoltronas(newPoltronas));
    dispatch(actions.changePoltrona(newPoltronaVal));
    isPristine && dispatch(actions.setPoltronaDirty());

    // valida poltrona
    const hasSelection = (newPoltronaVal.length > 0);
    this.updatePoltronaValidation(hasSelection);

  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.isFrozen;
  }

  handleResetSeats() {
    const isPristine = this.props.passagem.poltrona.isPristine;
    !isPristine && this.handleChangePoltrona('');
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
    const { dispatch, passagem, horarios } = this.props;
    const { poltrona } = passagem;
    let failed = false;

    if (horarios.length === 0) {
      failed = true;
    }

    // if POLTRONA is pristine, form cannot be saved
    if (poltrona.isPristine) {
      failed = true;
      const hasSelection = (poltrona.value.length > 0);
      dispatch(actions.setPoltronaDirty());
      this.updatePoltronaValidation(hasSelection);
    }

    if ((failed) || (poltrona.validation !== utils.ValidationStatus.NONE)) {
      return false;
    }

    return true;
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, passagem, history } = this.props;

    dispatch(loadingActions.setStatus(utils.SavingStatus.SAVING));

    if (this.formCanBeSaved()) {
      this.savePassagem(passagem)
        .then((obj) => {
          setTimeout(function () {
            dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
            history.push({
              pathname: `/passagem/${obj.key}`,
              state: {
                novaPassagem: obj.novaPassagem,
                key: obj.key
              }
            });
          }, 1000);
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

  savePassagem(passagem) {
    return new Promise((resolve, reject) => {
      const novaPassagem = helper.mapPassagemToFirebase(passagem);
      const { nome, email, cpf, origem, destino, data, horario, dataCompra } = novaPassagem;

      helper.poltronaToFirebase(novaPassagem.poltrona)
        .then((poltronasFormatadas) => {
          novaPassagem.poltrona = poltronasFormatadas;
          const dataFormatted = utils.dateToFirebase(data);
          const horarioFormatted = utils.timeToFirebase(horario);
          const emailFirebase = utils.emailToFirebaseKey(email);
          const newPassgemRef = `passagens/${emailFirebase}`;
          const poltronasSelecionadas = novaPassagem.poltrona.split(' - ');

          // salva passagem numa lista global
          firebaseHelper.save(novaPassagem, newPassgemRef)
            .then((key) => {

              // percorre as poltronas selecionada e salva uma por uma
              poltronasSelecionadas.forEach((val, index, arr) => {
                firebaseHelper.set({ nome, email, cpf, dataCompra },
                  `saidas/${origem}/${destino}/${dataFormatted}/${horarioFormatted}/${val}/`)
                  .then(() => {
                    if (index === (arr.length - 1)) {
                      resolve({ novaPassagem, key });
                    }
                  });
              });
            });
        });
    });
  };

  // getHorarios() {
  //   if (!this.props.horarios) {
  //     return null;
  //   }

  //   const arr = Object.keys(this.props.horarios);
  //   arr.sort();
  //   return arr.map(item => utils.firebaseToTime(item));
  // }

  // getHorariosVolta() {
  //   if (!this.props.horariosVolta) {
  //     return null;
  //   }

  //   const arr = Object.keys(this.props.horariosVolta);
  //   arr.sort();
  //   return arr.map(item => utils.firebaseToTime(item));
  // }

  render() {
    const { horarios, horariosVolta, poltronas, cidades, passagem, passagemVolta, isIdaVolta } = this.props;
    const getButtonIcon = () => isIdaVolta ? 'exchange' : 'long-arrow-right';
    const getButtonLabel = () => isIdaVolta ? 'Ida e volta' : 'Somente ida';
    const momentIda = moment(passagem.data.value, 'DD/MM/YYYY');
    const strDataIda = momentIda.format('DD / MM / YYYY');
    const momentVolta = moment(passagemVolta.data.value, 'DD/MM/YYYY');
    const strDataVolta = momentVolta.format('DD / MM / YYYY');
    const strOrigem = cidades[passagem.origem.value].label;
    const strDestino = cidades[passagem.destino.value].label;
    const getCollapseKey = (text, index) => `${text}-${index}`;

    const triggerIda = (
      <ButtonIcon
        type="button"
        className="btn-google-green btn-block collapse-trigger"
        label="08:05"
        icon="clock-o" />
    );

    const triggerVolta = (
      <ButtonIcon
        type="button"
        className="btn-google-red btn-block collapse-trigger"
        label="08:05"
        icon="clock-o" />
    );

    return (
      <div className="comprar-passagem-container">
        <PageHeader title="Compre sua passagem">
          <PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />
          <PageHeaderItem tooltip="Limpar campos" glyph="eraser" onClick={this.handleReset} />
        </PageHeader>
        <Navbar className="navbar-trajeto">
          <Navbar.Text className="text-trajeto">
            <span className="text-trajeto-cidades">
              <FontAwesome name="location-arrow" className="icon" />
              <span className="text-after-icon">{strOrigem}</span>
              <FontAwesome name="map-marker" className="text-trajeto-cidades-icondestino icon" />
              <span className="text-after-icon">{strDestino}</span>
            </span>
            <span className="delimiter">|</span>
            <span className="text-trajeto-data">
              <Label className="text-trajeto-data-ida">
                <FontAwesome name="arrow-circle-right" className="icon" />
                <span className="text-after-icon">{strDataIda}</span>
              </Label>
              {isIdaVolta &&
                <span>
                  {/*<FontAwesome name="exchange" className="text-trajeto-data-icon icon" />*/}
                  <Label className="text-trajeto-data-volta">
                    <span>{strDataVolta}</span>
                    <FontAwesome name="arrow-circle-left" className="icon icon-after-text" />
                  </Label>
                </span>}
            </span>
          </Navbar.Text>
          <Navbar.Text pullRight className="text-config">
            <ButtonIcon
              type="button"
              className="btn-google-glass"
              label="Alterar"
              icon="cog"
              onClick={this.handleChangeTrajeto} />
          </Navbar.Text>
        </Navbar>
        <div className="form-passagem-container">
          <DivAnimated className="form-centered">
            <div className="horarios-container">
              <Row>
                <Col xs={6}>
                  <ConditionalAccordion
                    className="accordion-ida"
                    array={horarios}
                    color="green"
                    icon="arrow-circle-right" />
                </Col>
                <Col xs={6}>
                  <ConditionalAccordion
                    className="accordion-volta"
                    array={horariosVolta}
                    color="red"
                    icon="arrow-circle-left" />
                </Col>
              </Row>
            </div>
          </DivAnimated>
        </div>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cidades: state.compraPassagemState.cidades,
    horarios: state.compraPassagemState.horarios,
    horariosVolta: state.compraPassagemState.horariosVolta,
    poltronas: state.compraPassagemState.poltronas,
    passagem: state.compraPassagemState.passagem,
    passagemVolta: state.compraPassagemState.passagemVolta,
    isIdaVolta: state.compraPassagemState.isIdaVolta,
    isFrozen: state.compraPassagemState.isFrozen,
    snapshot: state.compraPassagemState
  };
};

const CompraPassagemWithRouter = withRouter(CompraPassagem);
const CompraPassagemWithRouterAndAuth = withAuth(CompraPassagemWithRouter);
export default connect(mapStateToProps)(CompraPassagemWithRouterAndAuth);

              // <Row>
              //   <Col xs={6}>
              //     {arrHorarios && arrHorarios.map((item, index) =>
              //       <Collapsible
              //         key={index}
              //         transitionTime={200}
              //         trigger={
              //           <ButtonIcon
              //             type="button"
              //             className="btn-google-green btn-block collapse-trigger-button"
              //             label={item}
              //             icon="clock-o" />}
              //         className="collapse-ida"
              //         accordionPosition={getCollapseKey("collapse-ida", index)}
              //         easing={'cubic-bezier(0.175, 0.885, 0.32, 2.275)'}>
              //         item
              //       <BusSeatsSelect onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
              //       </Collapsible>
              //     )}
              //   </Col>
              //   <Col xs={6}>
              //     {arrHorariosVolta && arrHorariosVolta.map((item, index) =>
              //       <Collapsible
              //         key={index}
              //         transitionTime={200}
              //         trigger={
              //           <ButtonIcon
              //             type="button"
              //             className="btn-google-red btn-block collapse-trigger-button"
              //             label={item}
              //             icon="clock-o" />}
              //         className="collapse-volta"
              //         accordionPosition={getCollapseKey("collapse-volta", { index })} >
              //         item
              //       <BusSeatsSelect onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
              //       </Collapsible>
              //     )}
              //   </Col>
              // </Row>
