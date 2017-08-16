import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { FormControl, FormGroup, Row, InputGroup, Glyphicon, HelpBlock } from 'react-bootstrap';
import { ValidationStatus, LoginFields, SavingStatus } from '../shared/Utils';
import * as actions from '../actions/login.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import FontAwesome from 'react-fontawesome';
import Button from 'react-toolbox/lib/button/Button';
import DivAnimated from '../shared/DivAnimated';
import { PageHeader } from '../shared/PageHeader';
import * as loadingActions from '../actions/loadingDialog.actions'
import { globals } from '../shared/Globals';
import * as compraPassagemActions from '../actions/compraPassagem.actions'
import Input from 'react-toolbox/lib/input/Input';
import * as utils from '../shared/Utils';
import moment from 'moment';
import SpinnerButton from "../shared/SpinnerButton";

const fakeDataOptions = {
  days: 5,
  startHour: 6,
  endHour: 22,
  reservedPercentage: 0.2, // 20%
  horariosPercentage: 0.3, // 20%
  email: 'fake@busticket.com',
}

const fakeGenerator = (() => {
  const getFutureDay = daysAhead => moment().add(daysAhead, 'days').format('DD/MM/YYYY');
  const randomMinute = () => Math.floor((Math.random() * 59));
  const randomBoolean = () => !!Math.floor(Math.random() * 2);
  const randomPercent = percent => (Math.random() < percent);
  const randomPoltronas = () => {
    const master = Math.random();

    if (master < 0.1) {
      return (Math.random() < 0.9);
    }

    if (master < 0.2) {
      return (Math.random() < 0.6);
    }

    if (master < 0.3) {
      return (Math.random() < 0.3);
    }

    return (Math.random() < 0.1);
  }

  const generate = (cidades, options) => {
    const { days, startHour, endHour, horariosPercentage, email } = options;

    for (let o = 0; o < cidades.length; o++) {
      for (let d = 0; d < cidades.length; d++) {
        const origem = cidades[o];
        const destino = cidades[d];

        if (o !== d) { // só entre cidades diferentes!

          for (let i = 0; i <= days; i++) { // número de dias a serem gerados
            const data = utils.dateToFirebase(getFutureDay(i));

            for (let j = startHour; j <= endHour; j++) { // período válido para o horário
              if (randomPercent(horariosPercentage)) {
                const horario = j.toString().padStart(2, '0') + randomMinute().toString().padStart(2, '0');

                if (randomBoolean()) {
                  const refHora = `saidas/${origem}/${destino}/${data}/${horario}/`;
                  firebaseHelper.set({ status: utils.BusStatus.OCUPADO }, refHora);
                  for (let k = 1; k <= 44; k++) { // poltronas
                    if (randomPoltronas()) {
                      const poltrona = k.toString().padStart(2, '0');
                      const ref = `saidas/${origem}/${destino}/${data}/${horario}/${poltrona}`;
                      firebaseHelper.set({ user: email }, ref).then(() => {
                        console.log(ref);
                      });
                    }
                  }
                } else {
                  const ref = `saidas/${origem}/${destino}/${data}/${horario}/`;
                  firebaseHelper.set({ status: utils.BusStatus.VAZIO }, ref).then(() => {
                    // console.log(ref);
                  });
                }
              }

            }
          }
        }
      }
    }
  };

  return { generate };
})();

export class Login extends Component {
  constructor(props) {
    super(props);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeSenha = this.handleChangeSenha.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleGenerateFakeData = this.handleGenerateFakeData.bind(this);
    this.handleClearFakeData = this.handleClearFakeData.bind(this);
    props.dispatch(actions.resetLogin());
    this.state = {
      autenticando: false
    };
  }

  handleGenerateFakeData() {
    console.log('Apagando saídas...');
    firebaseHelper.delete('saidas/').then(() => {
      console.log('Saídas apagadas com sucesso!');
      console.log('Apagando passagens...');
      firebaseHelper.delete('passagens/').then(() => {
        console.log('Passagens apagadas com sucesso!');
        fakeGenerator.generate(globals.getCidadesRaw(), fakeDataOptions); // generate fake data
      });
    });
  }

  handleClearFakeData() {
    firebaseHelper.delete('saidas/').then(() => { });
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
    const text = event;

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
    console.log(event);
    const { senha, dispatch } = this.props;
    const isPristine = senha.isPristine;
    const text = event;
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

    const showSpinner = () =>
      this.setState({
        autenticando: true
      });

    const hideSpinner = () =>
      this.setState({
        autenticando: false
      });

    showSpinner();

    if (this.isLoginFormOK()) {
      firebaseHelper.signIn(email.text, senha.text)
        .then(() => {
          this.getStaticListCidades()
            .then(() => {
              setTimeout(() => {
                hideSpinner();
                history.push({
                  pathname: '/',
                  state: {}
                });
              }, 1000);
            });
        })
        .catch((error) => {
          if (error.field === LoginFields.EMAIL) { // E-MAIL
            dispatch(actions.setLoginEmailValidation(ValidationStatus.ERROR, error.text));
          } else { // SENHA
            dispatch(actions.setLoginSenhaValidation(ValidationStatus.ERROR, error.text));
          }
          hideSpinner();
        });
    } else {
      hideSpinner();
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
            <form>
              <Row className="main-section">
                <Input
                  type='email'
                  label='E-mail'
                  icon="email"
                  value={email.text}
                  autoComplete="off"
                  error={email.message}
                  onChange={this.handleChangeEmail}
                />
                <Input
                  type='password'
                  label='Senha'
                  icon="vpn_key"
                  value={senha.text}
                  autoComplete="off"
                  error={senha.message}
                  onChange={this.handleChangeSenha}
                />
              </Row>
              <Row className="footer-section">
                <span className="bt-mui-text">Login no sistema</span>
              </Row>
              <SpinnerButton
                className="btn-login mui--z2"
                icon="forward"
                spinning={this.state.autenticando}
                onClick={this.handleLogin}
              //onClick={this.handleGenerateFakeData}
              />
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
