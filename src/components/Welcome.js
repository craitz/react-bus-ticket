import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { Col, Jumbotron } from 'react-bootstrap';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader } from '../shared/PageHeader';
import store from '../store';
import * as actions from '../actions/modalTrajeto.actions';
import FontAwesome from 'react-fontawesome';
import Button from 'react-toolbox/lib/button/Button';

export const ButtonComprar = ({ handleComprar }) =>
  <div className="text-right welcome-button">
    <Button
      raised
      accent
      onClick={handleComprar}>
      <FontAwesome name="shopping-cart bt-mui-icon" />
      <span className="text-after-icon bt-mui-text">Compre agora sua passagem</span>
    </Button>
  </div>

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
        <PageHeader title="Seja bem-vindo !">
          {/*<PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />*/}
        </PageHeader>
        <DivAnimated className="info-container">
          <Col sm={8} smOffset={2}>
            <Jumbotron className="jumbo-painel mui--z3">
              <h2>Introdução</h2>
              <article>
                O BusTicket é uma SPA (Single Page Application) totalmente responsiva
                que utiliza o conceito Mobile First para se adaptar e responder adequadamante
                a qualquer tipo ou tamanho de tela. O objetivo da aplicação é simular
                um guichê virtual para compra de passagens de ônibus (sem os valores
                envolvidos na transação) para viagens entre algumas capitais do Brasil.
              </article>
              <hr />
              <h2>Algumas das tecnologias utilizadas</h2>
              <article>
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
              <hr />
              <ButtonComprar handleComprar={this.handleComprarPassagem} />
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