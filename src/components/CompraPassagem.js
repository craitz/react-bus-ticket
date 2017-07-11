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

const Seat = ({ children, className, onClickSeat, value }) => {
  return (
    <Label bsSize="xsmall" bsStyle="default" className={className} onClick={() => onClickSeat(value)}>{children}</Label>
  );
}

const BusRow = ({ rowClass, seats, onClickSeat, row }) => {
  const getValue = index => seats[index].value;
  const getLabel = index => seats[index].label;
  const getStatus = index => seats[index].status;

  return (
    <Row className={rowClass}>
      {row.map((seat, index) =>
        <Seat
          key={index}
          bsStyle="default"
          className={getStatus(seat)}
          onClickSeat={onClickSeat}
          value={getValue(seat)}>
          {getLabel(seat)}
        </Seat>)}
    </Row>

  );
}

const BusSeatsSelect = ({ seats, onClickSeat, onResetSeats }) => {
  return (
    <div className="bus-seat-select">
      {/*<Row className="bus-row bus-row-legenda">
        <Col xs={12}>
          <Label bsSize="xsmall" className="free legenda">
            <span>Livre</span>
          </Label>
          <Label bsSize="xsmall" className="selected legenda">
            <span>Selecionada</span>
          </Label>
          <Label bsSize="xsmall" className="reserved legenda">
            <span>Ocupada</span>
          </Label>
          <Button bsStyle="default" bsSize="xsmall" className="clean-bus pull-right" onClick={onResetSeats}>
            <FontAwesome name="times-circle" />
            <span className="text-after-icon">Limpar</span>
          </Button>
        </Col>
      </Row>*/}
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


export const FormIda = ({ props }) => {
  const { horarios, poltronas, passagem } = props.fields;
  const { handleChangeData, handleChangeHorario, handleChangePoltrona, handleClickSeat,
    handleResetSeats, handleSubmit } = props.handlers;
  const { data, horario, poltrona } = passagem;

  return (
    <form onSubmit={handleSubmit}>
      {/*DATA / HORARIO*/}
      <Row className="text-left">
        <Col xs={6} className="input-col">
          <DateField
            id="data"
            label="Data"
            value={data}
            onChange={handleChangeData} />
        </Col>
        <Col xs={6} className="input-col">
          <SelectField
            id="horario"
            label="Horário"
            list={horarios}
            value={horario.val}
            onChange={handleChangeHorario}
            emptyMessage="Não há mais saídas neste dia" />
        </Col>
      </Row>
      {/*POLTRONA*/}
      <Row className="text-left last">
        <Col md={12} className="input-col">
          <MultiSelectField
            id="poltrona"
            label="Poltrona(s)*"
            list={poltronas}
            value={poltrona.value}
            onChange={handleChangePoltrona}
            onClickSeat={handleClickSeat}
            onResetSeats={handleResetSeats}
            validation={poltrona.validation}
            message={poltrona.message}
            emptyMessage="Não há mais saídas neste dia" />
        </Col>
      </Row>
      <hr />
      <div className="text-right">
        <ButtonIconFit
          type="submit"
          className="btn-google-blue"
          labelAll="Finalizar compra"
          labelXs="Finalizar"
          icon="check" />
      </div>
    </form >
  )
};

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
    this.handleReset = this.handleReset.bind(this);
    this.handleChangePoltrona = this.handleChangePoltrona.bind(this);
    this.handleChangeHorario = this.handleChangeHorario.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
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


  render() {
    const { horarios, poltronas, cidades, passagem, passagemVolta, isIdaVolta } = this.props;
    const getButtonIcon = () => isIdaVolta ? 'exchange' : 'long-arrow-right';
    const getButtonLabel = () => isIdaVolta ? 'Ida e volta' : 'Somente ida';
    const formIdaProps = {
      fields: { horarios, poltronas, passagem },
      handlers: {
        handleChangeData: this.handleChangeData,
        handleChangeHorario: this.handleChangeHorario,
        handleChangePoltrona: this.handleChangePoltrona,
        handleClickSeat: this.handleClickSeat,
        handleResetSeats: this.handleResetSeats,
        handleSubmit: this.handleSubmit
      }
    }

    const momentIda = moment(passagem.data.value, 'DD/MM/YYYY');
    const strDataIda = momentIda.format('DD / MM / YYYY');
    const momentVolta = moment(passagemVolta.data.value, 'DD/MM/YYYY');
    const strDataVolta = momentVolta.format('DD / MM / YYYY');
    const strOrigem = cidades[passagem.origem.value].label;
    const strDestino = cidades[passagem.destino.value].label;

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
                  {

                  }
                  <Collapsible trigger={triggerIda} className="collapse-ida">
                    <BusSeatsSelect seats={poltronas} onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
                  </Collapsible>
                  <Collapsible trigger={triggerIda} className="collapse-ida">
                    <BusSeatsSelect seats={poltronas} onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
                  </Collapsible>
                </Col>
                <Col xs={6}>
                  <Collapsible trigger={triggerVolta} className="collapse-volta">
                    <BusSeatsSelect seats={poltronas} onClickSeat={this.handleClickSeat} onResetSeats={this.handleResetSeats} />
                  </Collapsible>
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
