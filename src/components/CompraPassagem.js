import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { BaseField, withSelect, withDate, withMultiSelect } from '../shared/FormFields';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { withAuth } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import { Row, Col, Button, Jumbotron } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated'
import moment from 'moment';
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import * as loadingActions from '../actions/loadingDialog.actions'

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
      let poltronasFormatadas = '';
      const array = poltrona.split(',');
      const padArray = array.map(item => (todasPoltronas[item].label).padStart(2, '0'));
      padArray.sort();
      const padString = padArray.join();
      const formatted = padString.replace(/,/g, ' - ');
      resolve(formatted);
    });
  }
};

const ButtonComprar = () =>
  <Button type="submit" bsStyle="primary" className="btn-google-blue">
    <FontAwesome name="check"></FontAwesome>
    <span className="text-after-icon hidden-xs">Finalizar compra</span>
    <span className="text-after-icon hidden-sm hidden-md hidden-lg">Finalizar</span>
  </Button>

export const FormComprar = ({ props }) => {
  const { cidades, horarios, poltronas, passagem } = props.fields;
  const { handleChangeOrigem, handleChangeDestino,
    handleChangeData, handleChangeHorario, handleChangePoltrona, handleClickSeat,
    handleResetSeats, handleSubmit } = props.handlers;
  const { origem, destino, data, horario, poltrona } = passagem;

  return (
    <form onSubmit={handleSubmit}>
      {/*ORIGEM / DESTINO*/}
      <Row className="text-left">
        <Col xs={12} className="input-col">
          <SelectField
            id="origem"
            label="Origem"
            list={cidades}
            value={origem.val}
            onChange={handleChangeOrigem} />
        </Col>
      </Row>
      <Row className="text-left">
        <Col xs={12} className="input-col">
          <SelectField
            id="destino"
            label="Destino"
            list={cidades}
            value={destino.val}
            onChange={handleChangeDestino} />
        </Col>
      </Row>
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
      <Row className="text-left">
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
        <ButtonComprar />
      </div>
    </form >
  )
};

export class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
    this.handleReset = this.handleReset.bind(this);
    this.handleChangeOrigem = this.handleChangeOrigem.bind(this);
    this.handleChangeDestino = this.handleChangeDestino.bind(this);
    this.handleChangePoltrona = this.handleChangePoltrona.bind(this);
    this.handleChangeHorario = this.handleChangeHorario.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleClickSeat = this.handleClickSeat.bind(this);
    this.handleResetSeats = this.handleResetSeats.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
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
    this.getDefaults();
    this.initLoadingDialog();
  }

  getDefaults() {
    const { dispatch } = this.props;
    this.canRender = false;

    globals.getCidades().then((cidades) => {
      dispatch(actions.setCidades(cidades));
      globals.getHorarios().then((horarios) => {
        dispatch(actions.setHorarios(horarios));
        dispatch(actions.setPoltronas(globals.getPoltronas()));
        this.canRender = true;
        this.reset();
        this.forceUpdate();
      });
    });
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

    // initialize ORIGEM values
    dispatch(actions.changeOrigem({
      val: 0,
      text: cidades[0]
    }));

    dispatch(actions.changeData(moment().format('DD/MM/YYYY')));

    // initialize DESTINO values
    dispatch(actions.changeDestino({
      val: 1,
      text: cidades[1]
    }));

    const newHorario = this.updateHorarios(utils.DateNowBr, true);
    this.updatePoltronas(cidades[0], cidades[1], utils.DateNowBr, newHorario);
  }

  handleChangeOrigem(event) {
    const { cidades, dispatch, passagem } = this.props;
    const { data, horario } = passagem;

    // build ORIGEM new state
    const origem = {
      val: Number(event.target.value),
      text: cidades[event.target.value]
    };
    // get DESTINO state
    const destino = {
      val: passagem.destino.val,
      text: passagem.destino.text
    };

    // change ORIGEM state!
    dispatch(actions.changeOrigem({
      val: origem.val,
      text: origem.text
    }));

    // if ORIGEM is already selected in DESTINO
    if (origem.val === destino.val) {
      // calculate new index for DESTINO
      const newIndexDestino = (destino.val === 0) ? (destino.val + 1) : (destino.val - 1);
      const newTextDestino = cidades[newIndexDestino];
      // change DESTINO state!
      dispatch(actions.changeDestino({
        val: newIndexDestino,
        text: newTextDestino
      }));
      this.updatePoltronas(origem.text, newTextDestino, data, horario.text);
    } else {
      this.updatePoltronas(origem.text, destino.text, data, horario.text);
    }
  }

  handleChangeDestino(event) {
    const { cidades, dispatch, passagem } = this.props;
    const { data, horario } = passagem;

    // build DESTINO new state
    const destino = {
      val: Number(event.target.value),
      text: cidades[event.target.value]
    };
    // get ORIGEM state
    const origem = {
      val: passagem.origem.val,
      text: passagem.origem.text
    };

    // change DESTINO state!
    dispatch(actions.changeDestino({
      val: destino.val,
      text: destino.text
    }));

    // if DESTINO is already selected in ORIGEM
    if (destino.val === origem.val) {
      // calculate new index for ORIGEM
      const newIndexOrigem = (origem.val === 0) ? (origem.val + 1) : (origem.val - 1);
      const newTextOrigem = cidades[newIndexOrigem];

      // change ORIGEM state!
      dispatch(actions.changeOrigem({
        val: newIndexOrigem,
        text: newTextOrigem
      }));
      this.updatePoltronas(newTextOrigem, destino.text, data, horario.text);
    } else {
      this.updatePoltronas(origem.text, destino.text, data, horario.text);
    }
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

  handleChangeData(value) {
    const { dispatch, passagem } = this.props;
    const data = value.format('DD/MM/YYYY');
    const { origem, destino } = passagem;

    dispatch(actions.changeData(data));

    const newHorario = this.updateHorarios(data);
    this.updatePoltronas(origem.text, destino.text, data, newHorario);
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
    const { cidades, dispatch } = this.props;
    dispatch(actions.resetFormPassagem(cidades));
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
    if (!this.canRender) {
      return null;
    }

    const formComprarProps = {
      fields: {
        cidades: this.props.cidades,
        horarios: this.props.horarios,
        poltronas: this.props.poltronas,
        passagem: this.props.passagem
      },
      handlers: {
        handleChangeNome: this.handleChangeNome,
        handleChangeCpf: this.handleChangeCpf,
        handleChangeOrigem: this.handleChangeOrigem,
        handleChangeDestino: this.handleChangeDestino,
        handleChangeData: this.handleChangeData,
        handleChangeHorario: this.handleChangeHorario,
        handleChangePoltrona: this.handleChangePoltrona,
        handleClickSeat: this.handleClickSeat,
        handleResetSeats: this.handleResetSeats,
        handleSubmit: this.handleSubmit
      }
    }

    return (
      <div className="comprar-passagem-container">
        <PageHeader title="Compre sua passagem">
          <PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />
          <PageHeaderItem tooltip="Limpar campos" glyph="eraser" onClick={this.handleReset} />
        </PageHeader>
        <div className="form-passagem-container">
          <DivAnimated className="form-centered">
            <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4}>
              <Col xs={12} className="form-header text-left">
                <span className="form-title hidden-xs">Por favor, preencha o formulário.</span>
                <span className="form-title hidden-sm hidden-md hidden-lg">Preencha o formulário.</span>
              </Col>
              <Jumbotron>
                <FormComprar props={formComprarProps} />
              </Jumbotron>
            </Col>
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
    passagem: state.compraPassagemState.passagem
  };
};

const CompraPassagemWithRouter = withRouter(CompraPassagem);
const CompraPassagemWithRouterAndAuth = withAuth(CompraPassagemWithRouter);
export default connect(mapStateToProps)(CompraPassagemWithRouterAndAuth);
