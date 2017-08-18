import React, { Component } from 'react';
import store from '../store';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import Button from 'react-toolbox/lib/button/Button';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader } from '../shared/PageHeader';
import * as actions from '../actions/modalTrajeto.actions';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    store.dispatch(actions.setVisible(true, true));
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    return (
      <div className="welcome-container">
        <PageHeader title="Bem-vindo !">
        </PageHeader>
        <DivAnimated className="info-container">
          <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={6} lgOffset={3}>
            <Jumbotron className="jumbo-painel mui--z2">
              <Row className="main-section">
                <h2 className="title-intro">Introdução</h2>
                <article className="intro">
                  O BusTicket é uma SPA (Single Page Application) totalmente responsiva
                  que utiliza o conceito Mobile First para se adaptar e responder adequadamante
                  a qualquer tipo ou tamanho de tela. O objetivo da aplicação é simular
                  um guichê virtual para compra de passagens de ônibus (sem os valores
                  envolvidos na transação) para viagens entre algumas capitais do Brasil.
                </article>
                <hr />
                <h2>Algumas das tecnologias utilizadas</h2>
                <article className="tech">
                  React,
                  Redux,
                  JSX,
                  Javascript (ES5,ES6,ES7),
                  Firebase,
                  Jest,
                  Enzyme,
                  TDD, DRY, SOLID, KISS,
                  Node.js, Node Package Manager,
                  Webpack,
                  Babel,
                  Boostrap, Material Design, Responsive Web Design,
                  Mobile First,
                  JSON,
                  Git,
                  CSS3,
                  SASS,
                  HTML5,
                  Visual Studio 2017.
                </article>
              </Row>
              <Row className="footer-section">
                <span className="bt-mui-text hidden-xs">Compre agora sua passagem !</span>
                <span className="bt-mui-text visible-xs">Comprar</span>
              </Row>
              <Button
                floating
                accent
                onClick={this.handleComprarPassagem}
                className="welcome-button mui--z2"
                icon="shopping_cart"
              />
            </Jumbotron>
          </Col>
        </DivAnimated>
      </div >
    );
  }
}

const welcomeWithRouter = withRouter(Welcome);
const welcomeWithRouterAndAuth = withAuth(welcomeWithRouter);
export default welcomeWithRouterAndAuth;