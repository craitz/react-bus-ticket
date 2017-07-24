import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { FormControl, FormGroup, InputGroup, Glyphicon, HelpBlock } from 'react-bootstrap';
import { ValidationStatus, LoginFields, SavingStatus } from '../shared/Utils';
import * as actions from '../actions/login.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated';
import * as loadingActions from '../actions/loadingDialog.actions'
import { globals } from '../shared/Globals';
import * as compraPassagemActions from '../actions/compraPassagem.actions'
import { ButtonIcon } from '../shared/ButtonIcon';
import { Button, Input } from 'muicss/react';

export const ButtonLogin = ({ handleLogin }) =>
  <FormGroup className="last">
    <Button
      color="primary"
      variant="raised"
      onClick={handleLogin}
      className="btn-block">
      <FontAwesome name="sign-in bt-mui-icon" />
      <span className="bt-mui-text">Entrar</span>
    </Button>
  </FormGroup>

export const LoginInputGroup = ({ id, type, field, glyph, placeholder, onChange }) =>
  <FormGroup controlId={id} validationState={field.validation}>
    <InputGroup>
      <InputGroup.Addon>
        <FontAwesome name={glyph} className="addon-icon"></FontAwesome>
      </InputGroup.Addon>
      <FormControl type={type} placeholder={placeholder} value={field.text} onChange={onChange} />
    </InputGroup>
    <HelpBlock>{field.message}</HelpBlock>
  </FormGroup>

export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeSenha = this.handleChangeSenha.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    props.dispatch(actions.resetLogin());
  }

  componentDidMount() {
    this.initLoadingDialog();
  }

  initLoadingDialog() {
    const { dispatch } = this.props;
    dispatch(loadingActions.setLoadingMessage('Autenticando usuário...'));
    dispatch(loadingActions.setLoadingIcon('spinner'));
  }

  updateEmailValidation(text) {
    const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (text.length === 0) { // EMPTY
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, 'Campo obrigatório'));
    } else if (!emailRegexp.test(text)) { // BAD FORMAT
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, 'Formato inválido'));
    } else { // OK
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.NONE, ''));
    }
  }

  handleChangeEmail(event) {
    const { email, dispatch } = this.props;
    const isPristine = email.isPristine;
    const text = event.target.value;

    dispatch(actions.changeLoginEmail(text));
    isPristine && dispatch(actions.setLoginEmailDirty());

    this.updateEmailValidation(text);
  }

  updateSenhaValidation(text) {
    if (text.length === 0) { // REQUIRED
      this.props.dispatch(actions.setLoginSenhaValidation(ValidationStatus.ERROR, 'Campo obrigatório'));
    } else if (text.length < 6) { // MIN LENGTH
      this.props.dispatch(actions.setLoginSenhaValidation(ValidationStatus.ERROR, 'A senha deve ter no mínimo 6 caracteres'));
    } else { // OK
      this.props.dispatch(actions.setLoginSenhaValidation(ValidationStatus.NONE, ''));
    }
  }

  handleChangeSenha(event) {
    const { senha, dispatch } = this.props;
    const isPristine = senha.isPristine;
    const text = event.target.value;
    dispatch(actions.changeLoginSenha(text));
    isPristine && dispatch(actions.setLoginSenhaDirty());

    this.updateSenhaValidation(text);
  }

  isLoginFormOK() {
    const { email, senha, dispatch } = this.props;
    let countPristines = 0;

    // if E-MAIL is pristine, form cannot be saved
    if (email.isPristine) {
      countPristines++;
      dispatch(actions.setLoginEmailDirty());
      this.updateEmailValidation(email.text);
    }

    // if EMAIL is pristine, form cannot be saved
    if (senha.isPristine) {
      countPristines++;
      dispatch(actions.setLoginSenhaDirty());
      this.updateSenhaValidation(senha.text);
    }
    // if any field is pristine or invalid, form cannot be saved
    if ((countPristines > 0) ||
      (email.validation !== ValidationStatus.NONE) ||
      (senha.validation !== ValidationStatus.NONE)) {
      return false;
    }

    return true;
  }

  getStaticListCidades() {
    return new Promise(resolve => {
      const { dispatch } = this.props;
      globals.getCidades().then((cidades) => {
        dispatch(compraPassagemActions.setCidades(cidades));
        resolve();
      });
    });
  }

  handleLogin(event) {
    event.preventDefault();
    const { email, senha, history, dispatch } = this.props;

    dispatch(loadingActions.setStatus(SavingStatus.SAVING));

    if (this.isLoginFormOK()) {
      firebaseHelper.signIn(email.text, senha.text)
        .then(() => {
          this.getStaticListCidades()
            .then(() => {
              dispatch(loadingActions.setStatus(SavingStatus.DONE));
              history.push({
                pathname: '/',
                state: {}
              });
            });
        })
        .catch((error) => {
          if (error.field === LoginFields.EMAIL) { // E-MAIL
            dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, error.text));
          } else { // SENHA
            dispatch(actions.setLoginSenhaValidation(ValidationStatus.ERROR, error.text));
          }
          dispatch(loadingActions.setStatus(SavingStatus.DONE));
        });
    } else {
      dispatch(loadingActions.setStatus(SavingStatus.DONE));
    }
  }

  render() {
    const { email, senha } = this.props;
    if (firebaseHelper.isLoggedIn()) {
      return (
        <Redirect to='/' />
      );
    } else {
      return (
        <div className="login-container">
          <DivAnimated className="login-box mui--z2">
            <div className="login-header">
              <div className="login-header--title">
                <div className="login-header--title-main">Login</div>
                {/*<div className="login-header--title-sub text-muted">
                  <span>Informe o usuário e a senha</span>
                </div>*/}
              </div>
              <div className="login-header--icon text-right">
                <Glyphicon glyph="lock" className="main-icon" />
              </div>
            </div>
            <form>
              <Input
                label="E-mail"
                type="email"
                floatingLabel={true}
                required={true}
                autoComplete="off"
                value={email.text}
                onChange={this.handleChangeEmail}
              />
              {/*<small className="help-block">{email.message}</small>*/}
              <Input
                label="Senha"
                type="password"
                floatingLabel={true}
                required={true}
                autoComplete="off"
                value={senha.text}
                onChange={this.handleChangeSenha}
              />
              {/*<HelpBlock>{senha.message}</HelpBlock>*/}

              {/*<Input label="Input 1" floatingLabel={true} />
              <Input label="Input 1" floatingLabel={true} />*/}
              {/*<LoginInputGroup
                id="email"
                type="text"
                field={email}
                glyph="user"
                placeholder="E-mail"
                onChange={this.handleChangeEmail}
              />
              <LoginInputGroup
                id="senha"
                type="password"
                field={senha}
                glyph="key"
                placeholder="Senha"
                onChange={this.handleChangeSenha}
              />*/}
              <ButtonLogin handleLogin={this.handleLogin} />
            </form>
          </DivAnimated>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.loginState.email,
    senha: state.loginState.senha
  };
};

const LoginWithRouter = withRouter(Login);
export default connect(mapStateToProps)(LoginWithRouter);
