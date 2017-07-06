import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { connect } from 'react-redux';
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import DivAnimated from '../shared/DivAnimated'
import { Row, Col, Button, Jumbotron } from 'react-bootstrap';
import { BaseField, withInput, withInputMask } from '../shared/FormFields';
import FontAwesome from 'react-fontawesome';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as actions from '../actions/perfilUsuario.actions'
import * as loadingActions from '../actions/loadingDialog.actions'
import * as utils from '../shared/Utils';
// import PropTypes from 'prop-types';

const ButtonAtualizar = () =>
  <Button type="submit" bsStyle="primary" className="btn-google-blue">
    <FontAwesome name="refresh" />
    <span className="text-after-icon hidden-xs">Atualizar dados</span>
    <span className="text-after-icon hidden-sm hidden-md hidden-lg">Atualizar</span>
  </Button>


const FormPerfil = ({ onSubmit, onChangeNome, onChangeCpf, user }) => {
  const { nome, cpf } = user;

  return (
    <form onSubmit={onSubmit}>
      <Row className="text-left first">
        <Col xs={12}>
          <InputField
            id="nome"
            label="Nome*"
            type="text"
            value={nome.text}
            onChange={onChangeNome}
            validation={nome.validation}
            message={nome.message} />
        </Col>
      </Row>
      <Row className="text-left first">
        <Col xs={12}>
          <InputMaskField
            id="cpf"
            label="CPF*"
            mask="111.111.111-11"
            value={cpf.text}
            onChange={onChangeCpf}
            validation={cpf.validation}
            message={cpf.message} />
        </Col>
      </Row>
      <hr />
      <div className="text-right">
        <ButtonAtualizar />
      </div>
    </form>
  );
}

const InputField = withInput(BaseField);
const InputMaskField = withInputMask(BaseField);

class PerfilUsuario extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
    this.handleChangeNome = this.handleChangeNome.bind(this);
    this.handleChangeCpf = this.handleChangeCpf.bind(this);
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
  }

  initLoadingDialog() {
    const { dispatch } = this.props;
    dispatch(loadingActions.setLoadingMessage('Salvando alterações...'));
    dispatch(loadingActions.setLoadingIcon('spinner'));
    dispatch(loadingActions.setDoneMessage('Perfil salvo com sucesso !'));
    dispatch(loadingActions.setDoneIcon('check'));
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/comprar');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  handleChangeNome(event) {
    event.preventDefault();
    const { dispatch, user } = this.props;
    const isPristine = user.nome.isPristine;
    const text = event.target.value;

    dispatch(actions.changeNome(text));
    isPristine && dispatch(actions.setNomeDirty());

    this.updateNomeValidation(text);
  }

  handleChangeCpf(event) {
    event.preventDefault();
    const { dispatch, user } = this.props;
    const isPristine = user.cpf.isPristine;
    const text = event.target.value;

    dispatch(actions.changeCpf(text));
    isPristine && dispatch(actions.setCpfDirty());

    this.updateCpfValidation(text);
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

    if ((failed) ||
      (nome.validation !== utils.ValidationStatus.NONE) ||
      (cpf.validation !== utils.ValidationStatus.NONE)) {
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
      onChangeNome: this.handleChangeNome,
      onChangeCpf: this.handleChangeCpf,
      onSubmit: this.handleSubmit,
    }

    return (
      <div className="perfil-usuario-container">
        <PageHeader title="Perfil do usuário">
          <PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />
          <PageHeaderItem tooltip="Comprar passagens" glyph="shopping-cart" onClick={this.handleComprarPassagem} />
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
  };
};

const PerfilUsuarioWithRouter = withRouter(PerfilUsuario);
const PerfilUsuarioWithRouterAndAuth = withAuth(PerfilUsuarioWithRouter);
export default connect(mapStateToProps)(PerfilUsuarioWithRouterAndAuth);
