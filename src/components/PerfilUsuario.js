import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { connect } from 'react-redux';
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import DivAnimated from '../shared/DivAnimated'
import { Row, Col, Jumbotron } from 'react-bootstrap';
import { BaseField, withInput, withInputMask } from '../shared/FormFields';
import FontAwesome from 'react-fontawesome';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as actions from '../actions/perfilUsuario.actions'
import * as loadingActions from '../actions/loadingDialog.actions'
import * as utils from '../shared/Utils';
import TooltipOverlay from '../shared/TooltipOverlay';
import Button from 'react-toolbox/lib/button/Button';
import Input from 'react-toolbox/lib/input/Input';
import VMasker from 'vanilla-masker';
import * as snackbarActions from '../actions/snackbar.actions'
import Snackbar from '../shared/Snackbar';
// import PropTypes from 'prop-types';

const ButtonAtualizar = () =>
  <Button
    type="submit"
    floating
    accent
    className="btn-salvar mui--z2">
    <FontAwesome name="check fa-fw" />
  </Button>

const FormPerfil = ({ onSubmit, onChangeNome, onChangeCpf, onChangeDataNascimento,
  onChangeTelefone, onChangeCelular, user, edicaoHabilitada }) => {
  const { nome, cpf, dataNascimento, telefone, celular } = user;

  return (
    <form onSubmit={onSubmit}>
      <Row className="main-section">
        <Row className="text-left">
          <Col xs={12}>
            <Input
              type='text'
              label='Nome*'
              icon={<FontAwesome name="user" />}
              value={nome.text}
              autoComplete="off"
              error={nome.message}
              onChange={onChangeNome}
            />
          </Col>
        </Row>
        <Row className="text-left">
          <Col xs={12}>
            <Input
              type='text'
              label='CPF*'
              icon={<FontAwesome name="id-card-o" />}
              value={cpf.text}
              autoComplete="off"
              error={cpf.message}
              onChange={onChangeCpf}
            />
          </Col>
        </Row>
        <Row className="text-left">
          <Col xs={12}>
            <Input
              type='text'
              label='Data de nascimento*'
              icon={<FontAwesome name="birthday-cake" />}
              value={dataNascimento.text}
              autoComplete="off"
              error={dataNascimento.message}
              onChange={onChangeDataNascimento}
            />
          </Col>
        </Row>
        <Row className="text-left">
          <Col xs={12}>
            <Input
              type='text'
              label='Telefone*'
              icon={<FontAwesome name="phone" />}
              value={telefone.text}
              autoComplete="off"
              error={telefone.message}
              onChange={onChangeTelefone}
            />
          </Col>
        </Row>
        <Row className="text-left">
          <Col xs={12}>
            <Input
              type='text'
              label='Celular*'
              icon={<FontAwesome name="mobile" />}
              value={celular.text}
              autoComplete="off"
              error={celular.message}
              onChange={onChangeCelular}
            />
          </Col>
        </Row>
      </Row>
      <Row className="footer-section">
        <span>Salvar alterações</span>
      </Row>
      <ButtonAtualizar />
    </form>
  );
}

class PerfilUsuario extends Component {
  constructor(props) {
    super(props);
    this.handleChangeNome = this.handleChangeNome.bind(this);
    this.handleChangeCpf = this.handleChangeCpf.bind(this);
    this.handleChangeDataNascimento = this.handleChangeDataNascimento.bind(this);
    this.handleChangeTelefone = this.handleChangeTelefone.bind(this);
    this.handleChangeCelular = this.handleChangeCelular.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.initForm();
  }

  initForm() {
    const { dispatch } = this.props;
    const user = firebaseHelper.getUser();
    dispatch(actions.changeNome(user.nome));
    dispatch(actions.setNomeDirty());
    dispatch(actions.changeCpf(user.cpf));
    dispatch(actions.setCpfDirty());
    dispatch(actions.changeDataNascimento(user.dataNascimento));
    dispatch(actions.setDataNascimentoDirty());
    dispatch(actions.changeTelefone(user.telefone));
    dispatch(actions.setTelefoneDirty());
    dispatch(actions.changeCelular(user.celular));
    dispatch(actions.setCelularDirty());
  }

  handleChangeNome(event) {
    const { dispatch, user } = this.props;
    const isPristine = user.nome.isPristine;
    const text = event;

    dispatch(actions.changeNome(text));
    isPristine && dispatch(actions.setNomeDirty());

    this.updateNomeValidation(text);
  }

  handleChangeCpf(event) {
    const { dispatch, user } = this.props;
    const isPristine = user.cpf.isPristine;
    const text = VMasker.toPattern(event, '999.999.999-99');

    dispatch(actions.changeCpf(text));
    isPristine && dispatch(actions.setCpfDirty());

    this.updateCpfValidation(text);
  }

  handleChangeDataNascimento(event) {
    const { dispatch, user } = this.props;
    const isPristine = user.dataNascimento.isPristine;
    const text = VMasker.toPattern(event, '99/99/9999');

    dispatch(actions.changeDataNascimento(text));
    isPristine && dispatch(actions.setDataNascimentoDirty());

    this.updateDataNascimentoValidation(text);
  }

  handleChangeTelefone(event) {
    const { dispatch, user } = this.props;
    const isPristine = user.telefone.isPristine;
    const text = VMasker.toPattern(event, '(99) 9999-9999');

    dispatch(actions.changeTelefone(text));
    isPristine && dispatch(actions.setTelefoneDirty());

    this.updateTelefoneValidation(text);
  }

  handleChangeCelular(event) {
    const { dispatch, user } = this.props;
    const isPristine = user.celular.isPristine;
    const text = VMasker.toPattern(event, '(99) 99999-9999');

    dispatch(actions.changeCelular(text));
    isPristine && dispatch(actions.setCelularDirty());

    this.updateCelularValidation(text);
  }

  updateCelularValidation(text) {
    const { dispatch } = this.props;
    const regexp = /^(\([0-9]{2}\) [9][0-9]{4}-[0-9]{4})|(\(1[2-9]\) [5-9][0-9]{3}-[0-9]{4})|(\([2-9][1-9]\) [5-9][0-9]{3}-[0-9]{4})$/;

    if (text.length === 0) { // EMPTY
      dispatch(actions.setCelularValidation(utils.ValidationStatus.ERROR, 'Informe o celular'));
    } else if (!regexp.test(text)) { // BAD FORMAT
      dispatch(actions.setCelularValidation(utils.ValidationStatus.ERROR, 'celular inválido'));
    } else { // OK
      dispatch(actions.setCelularValidation(utils.ValidationStatus.NONE, ''));
    }
  }

  updateTelefoneValidation(text) {
    const { dispatch } = this.props;
    const regexp = /^(\([0-9]{2}\) [0-9]{4}-[0-9]{4})|(\(1[2-9]\) [5-9][0-9]{3}-[0-9]{4})|(\([2-9][1-9]\) [5-9][0-9]{3}-[0-9]{4})$/;

    if (text.length === 0) { // EMPTY
      dispatch(actions.setTelefoneValidation(utils.ValidationStatus.ERROR, 'Informe o telefone'));
    } else if (!regexp.test(text)) { // BAD FORMAT
      dispatch(actions.setTelefoneValidation(utils.ValidationStatus.ERROR, 'telefone inválido'));
    } else { // OK
      dispatch(actions.setTelefoneValidation(utils.ValidationStatus.NONE, ''));
    }
  }

  updateDataNascimentoValidation(text) {
    const { dispatch } = this.props;
    const regexp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    if (text.length === 0) { // EMPTY
      dispatch(actions.setDataNascimentoValidation(utils.ValidationStatus.ERROR, 'Informe a data de nascimento'));
    } else if (!regexp.test(text)) { // BAD FORMAT
      dispatch(actions.setDataNascimentoValidation(utils.ValidationStatus.ERROR, 'data inválida'));
    } else { // OK
      dispatch(actions.setDataNascimentoValidation(utils.ValidationStatus.NONE, ''));
    }
  }

  updateNomeValidation(text) {
    const { dispatch, user } = this.props;
    const oldName = user.nome;

    // test required
    if (text.length > 0) {
      (oldName.validation !== utils.ValidationStatus.NONE) &&
        dispatch(actions.setNomeValidation(utils.ValidationStatus.NONE, ''));
    } else {
      (oldName.validation !== utils.ValidationStatus.ERROR) &&
        dispatch(actions.setNomeValidation(utils.ValidationStatus.ERROR, 'Informe o nome'));
    }
  }

  updateCpfValidation(text) {
    const { dispatch } = this.props;
    const cpfRegexp = /^\d{3}.\d{3}.\d{3}-\d{2}$/;

    if (text.length === 0) { // EMPTY
      dispatch(actions.setCpfValidation(utils.ValidationStatus.ERROR, 'Informe o CPF'));
    } else if (!cpfRegexp.test(text)) { // BAD FORMAT
      dispatch(actions.setCpfValidation(utils.ValidationStatus.ERROR, 'CPF inválido'));
    } else { // OK
      dispatch(actions.setCpfValidation(utils.ValidationStatus.NONE, ''));
    }
  }


  formCanBeSaved() {
    const { dispatch, user } = this.props;
    const { nome, cpf, dataNascimento, telefone, celular } = user;
    let failed = false;

    // if NOME is pristine, form cannot be saved
    if (nome.isPristine) {
      failed = true;
      dispatch(actions.setNomeDirty());
      this.updateNomeValidation(nome.text);
    }

    // if CPF is pristine, form cannot be saved
    if (cpf.isPristine) {
      failed = true;
      dispatch(actions.setCpfDirty());
      this.updateCpfValidation(cpf.text);
    }

    // if DATANASC is pristine, form cannot be saved
    if (dataNascimento.isPristine) {
      failed = true;
      dispatch(actions.setDataNascimentoDirty());
      this.updateDataNascimentoValidation(dataNascimento.text);
    }

    // if TELEFONE is pristine, form cannot be saved
    if (telefone.isPristine) {
      failed = true;
      dispatch(actions.setTelefoneDirty());
      this.updateTelefoneValidation(telefone.text);
    }

    // if CELULAR is pristine, form cannot be saved
    if (celular.isPristine) {
      failed = true;
      dispatch(actions.setCelularDirty());
      this.updateCelularValidation(celular.text);
    }

    if ((failed) ||
      (nome.validation !== utils.ValidationStatus.NONE) ||
      (cpf.validation !== utils.ValidationStatus.NONE) ||
      (telefone.validation !== utils.ValidationStatus.NONE) ||
      (celular.validation !== utils.ValidationStatus.NONE) ||
      (dataNascimento.validation !== utils.ValidationStatus.NONE)) {
      return false;
    }

    return true;
  }


  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, user } = this.props;

    dispatch(loadingActions.setLoading('Saalvando alterações...'));
    if (this.formCanBeSaved()) {

      const newUser = {
        nome: user.nome.text,
        cpf: user.cpf.text,
        dataNascimento: user.dataNascimento.text,
        telefone: user.telefone.text,
        celular: user.celular.text
      };

      setTimeout(() => {
        firebaseHelper.setUserOnFirebase(newUser)
          .then(() => {
            dispatch(loadingActions.setDone());
            dispatch(snackbarActions.show(utils.SnackbarTypes.SUCCESS, 'Perfil salvo com sucesso!'));
          })
          .catch((error) => {
            dispatch(loadingActions.setDone());
          });
      }, 1000);
    } else {
      dispatch(loadingActions.setDone());
    }
  }

  render() {
    const formProps = {
      user: this.props.user,
      edicaoHabilitada: this.props.edicaoHabilitada,
      onChangeNome: this.handleChangeNome,
      onChangeCpf: this.handleChangeCpf,
      onChangeDataNascimento: this.handleChangeDataNascimento,
      onChangeTelefone: this.handleChangeTelefone,
      onChangeCelular: this.handleChangeCelular,
      onSubmit: this.handleSubmit
    }

    return (
      <div className="perfil-usuario-container">
        <PageHeader title="Perfil do usuário">
        </PageHeader>
        <DivAnimated className="text-center">
          <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="text-center">
            <Jumbotron>
              <FormPerfil {...formProps} />
            </Jumbotron>
          </Col>
        </DivAnimated>
        <Snackbar />
      </div>
    );
  }
}

// PerfilUsuario.PropTypes = {}
// PerfilUsuario.defaultProps = {}

const mapStateToProps = (state) => {
  return {
    user: state.perfilUsuarioState.user,
    edicaoHabilitada: state.perfilUsuarioState.edicaoHabilitada
  };
};

const PerfilUsuarioWithRouter = withRouter(PerfilUsuario);
const PerfilUsuarioWithRouterAndAuth = withAuth(PerfilUsuarioWithRouter);
export default connect(mapStateToProps)(PerfilUsuarioWithRouterAndAuth);
