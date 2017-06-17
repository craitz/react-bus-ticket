import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  FormControl,
  FormGroup,
  InputGroup,
  Glyphicon,
  Button,
  HelpBlock
} from 'react-bootstrap';
import { ValidationStatus } from '../shared/Utils'
import * as actions from '../actions/login.actions'
import FirebaseHelper from '../shared/FirebaseHelper'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeSenha = this.handleChangeSenha.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateEmailValidation(text) {
    const emailRegexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (text.length === 0) { // EMPTY
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, 'Campo obrigatório'));
    } else if (!emailRegexp.test(text)) { // BAD FORMAT
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, 'Formato inválido'));
    } else { // OK
      this.props.dispatch(actions.setLoginEmailValidation(ValidationStatus.SUCCESS, ''));
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
      this.props.dispatch(actions.setLoginSenhaValidation(ValidationStatus.SUCCESS, ''));
    }
  }

  handleChangeSenha(event) {
    const { senha, dispatch } = this.props;
    const isPristine = senha.isPristine;
    const text = event.target.value;
    console.log(text);
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
      (email.validation !== ValidationStatus.SUCCESS) ||
      (senha.validation !== ValidationStatus.SUCCESS)) {
      return false;
    }

    return true;
  }

  handleSubmit(event) {
    const { email, senha, history } = this.props;

    if (this.isLoginFormOK()) {
      FirebaseHelper.login(email.text, senha.text)
        .then(() => {
          history.push({
            pathname: '/',
            state: {}
          });
        });
    }

    event.preventDefault();
  }

  render() {
    const { email, senha } = this.props;
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="login-header--title">
              <div className="login-header--title-main">Login</div>
              <div className="login-header--title-sub text-muted">
                <span>Informe o usuário e a senha</span>
              </div>
            </div>
            <div className="login-header--icon text-right">
              <Glyphicon glyph="lock" className="main-icon" />
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="email" validationState={email.validation}>
              <InputGroup>
                <InputGroup.Addon>
                  <Glyphicon glyph="user" className="addon-icon" />
                </InputGroup.Addon>
                <FormControl type="text" placeholder="E-mail" value={email.text} onChange={this.handleChangeEmail} />
              </InputGroup>
              <FormControl.Feedback />
              <HelpBlock>{email.message}</HelpBlock>
            </FormGroup>
            <FormGroup controlId="senha" validationState={senha.validation}>
              <InputGroup>
                <InputGroup.Addon>
                  <Glyphicon glyph="barcode" className="addon-icon" />
                </InputGroup.Addon>
                <FormControl type="password" placeholder="Senha" value={senha.text} onChange={this.handleChangeSenha} />
              </InputGroup>
              <FormControl.Feedback />
              <HelpBlock>{senha.message}</HelpBlock>
            </FormGroup>
            <FormGroup>
              <Button type="submit" bsStyle="primary" className="btn-block">
                <Glyphicon glyph="log-in" />
                <span className="text-after-icon">Entrar</span>
                {/*<i ng-show="$ctrl.isBusy" className="fa fa-spinner fa-spin"></i>
                <div ng-show="!$ctrl.isBusy">
                  <i className="fa fa-sign-in"></i>
                  <span>Entrar</span>
                </div>*/}
              </Button>
            </FormGroup>
          </form>
        </div>
      </div>
    );
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
