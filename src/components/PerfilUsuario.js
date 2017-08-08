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
// import PropTypes from 'prop-types';

const ButtonAtualizar = () =>
  <Button
    type="submit"
    floating
    accent
    className="btn-salvar mui--z2">
    <FontAwesome name="check fa-fw" />
  </Button>

const FormPerfil = ({ onSubmit, onChangeNome, onChangeCpf, onChangeDataNascimento, user, edicaoHabilitada }) => {
  const { nome, cpf, dataNascimento } = user;

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
      </Row>
      <Row className="footer-section">
        <span>Salvar alterações</span>
      </Row>
      <ButtonAtualizar />
    </form>
  );
}

const InputField = withInput(BaseField);
const InputMaskField = withInputMask(BaseField);

class PerfilUsuario extends Component {
  constructor(props) {
    super(props);
    this.handleChangeNome = this.handleChangeNome.bind(this);
    this.handleChangeCpf = this.handleChangeCpf.bind(this);
    this.handleChangeDataNascimento = this.handleChangeDataNascimento.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.initForm();
    this.initLoadingDialog();
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
  }

  initLoadingDialog() {
    const { dispatch } = this.props;
    dispatch(loadingActions.setLoadingMessage('Salvando alterações...'));
    dispatch(loadingActions.setLoadingIcon('spinner'));
    dispatch(loadingActions.setDoneMessage('Perfil salvo com sucesso !'));
    dispatch(loadingActions.setDoneIcon('check'));
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
    const { dispatch, user, dataNascimento } = this.props;
    const { nome, cpf } = user;
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

    if ((failed) ||
      (nome.validation !== utils.ValidationStatus.NONE) ||
      (cpf.validation !== utils.ValidationStatus.NONE) ||
      (dataNascimento.validation !== utils.ValidationStatus.NONE)) {
      return false;
    }

    return true;
  }


  handleSubmit(event) {
    event.preventDefault();
    const { dispatch, user } = this.props;

    dispatch(loadingActions.setStatus(utils.SavingStatus.SAVING));
    if (this.formCanBeSaved()) {

      const newUser = {
        nome: user.nome.text,
        cpf: user.cpf.text
      };

      setTimeout(() => {
        firebaseHelper.setUserOnFirebase(newUser)
          .then(() => {
            dispatch(loadingActions.setStatus(utils.SavingStatus.FEEDBACK));
            setTimeout(() => {
              dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
              dispatch(actions.setEdicaoHabilitada(false));
            }, 1000);
          })
          .catch((error) => {
            dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
          });
      }, 1000);
    } else {
      dispatch(loadingActions.setStatus(utils.SavingStatus.DONE));
    }
  }

  render() {
    const formProps = {
      user: this.props.user,
      edicaoHabilitada: this.props.edicaoHabilitada,
      onChangeNome: this.handleChangeNome,
      onChangeCpf: this.handleChangeCpf,
      onChangeDataNascimento: this.handleChangeDataNascimento,
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
