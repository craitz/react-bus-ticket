import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Redirect } from 'react-router';
import { FormControl, FormGroup, InputGroup, Glyphicon, Row, HelpBlock } from 'react-bootstrap';
import { ValidationStatus, LoginFields, SavingStatus } from '../shared/Utils';
import * as actions from '../actions/login.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated';
import * as loadingActions from '../actions/loadingDialog.actions'
import { globals } from '../shared/Globals';
import * as compraPassagemActions from '../actions/compraPassagem.actions'
import { ButtonIcon } from '../shared/ButtonIcon';
// import { Input } from 'muicss/react';
import Button from 'react-toolbox/lib/button/Button';
import IconButton from 'react-toolbox/lib/button/IconButton';
import Input from 'react-toolbox/lib/input/Input';
import * as utils from '../shared/Utils';
import moment from 'moment';

const fakeDataOptions = {
  days: 5,
  startHour: 6,
  endHour: 22,
  reservedPercentage: 0.2, // 20%
  horariosPercentage: 0.3, // 20%
  email: 'guest@busticket.com',
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

export const ButtonLogin = ({ handleLogin }) =>
  <FormGroup className="last">
    <Button
      raised
      primary
      className="btn-block"
      onClick={handleLogin}>
      <FontAwesome name="sign-in bt-mui-icon" />
      <span className="text-after-icon bt-mui-text">Entrar</span>
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
    this.handleGenerateFakeData = this.handleGenerateFakeData.bind(this);
    this.handleClearFakeData = this.handleClearFakeData.bind(this);
    props.dispatch(actions.resetLogin());
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
                <div className="login-header--title-main">
                  Login
                  <Button
                    floating
                    primary
                    mini
                    className="text-after-icon"
                    onClick={this.handleGenerateFakeData}
                    icon={<FontAwesome name="database" />}
                  />
                  {/*<Button
                    floating
                    accent
                    mini
                    className="text-after-icon"
                    onClick={this.handleClearFakeData}
                    icon={<FontAwesome name="eraser" />}
                  />*/}

                </div>
              </div>
              <div className="login-header--icon text-right">
                <Glyphicon glyph="lock" className="main-icon" />
              </div>
            </div>
            <form>
              <Input
                type='email'
                label='E-mail'
                icon={<FontAwesome name="envelope" />}
                value={email.text}
                autoComplete="off"
                error={email.message}
                onChange={this.handleChangeEmail}
              />
              <Input
                type='password'
                label='Senha'
                icon={<FontAwesome name="key" />}
                value={senha.text}
                autoComplete="off"
                error={senha.message}
                onChange={this.handleChangeSenha}
              />
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
