import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { FormControl, FormGroup, InputGroup, Glyphicon, Button } from 'react-bootstrap';
import { ValidationStatus } from '../shared/Utils'

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
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
              <Glyphicon glyph="log-in" className="main-icon" />
            </div>
          </div>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <Glyphicon glyph="envelope" className="addon-icon" />
                </InputGroup.Addon>
                <FormControl type="text" placeholder="E-mail" />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <Glyphicon glyph="lock" className="addon-icon" />
                </InputGroup.Addon>
                <FormControl type="text" placeholder="Senha" />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Button type="submit" bsStyle="primary" className="btn-block">
                Entrar
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

export default connect(mapStateToProps)(withRouter(Login));
