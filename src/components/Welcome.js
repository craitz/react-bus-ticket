import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { Col, Jumbotron } from 'react-bootstrap';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import store from '../store';
import * as actions from '../actions/modalTrajeto.actions';
import { ButtonIconFit } from '../shared/ButtonIcon';

export const ButtonComprar = ({ handleComprar }) =>
  <div className="text-center welcome-button">
    <ButtonIconFit
      type="button"
      className="btn btn-glass-blue"
      labelAll="Compre agora sua passagem!"
      labelXs="Comprar passagens"
      icon="shopping-cart"
      onClick={handleComprar} />
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
          <PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />
        </PageHeader>
        <DivAnimated className="text-center info-container">
          <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="text-left">
            <h1>Introdução</h1>
            <article className="text-left">
              O BusTicket é uma SPA (Single Page Application) totalmente responsiva
              que utiliza o conceito Mobile First para se adaptar e responder adequadamante
              a qualquer tipo ou tamanho de tela. O objetivo da aplicação é simular
              um guichê virtual para compra de passagens de ônibus (sem os valores
              envolvidos na transação) para viagens entre as capitais de Brasil.
          </article>
            <hr />
            <h1>Algumas das tecnologias utilizadas:</h1>
            <article className="text-left tech">
              <Jumbotron>
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
                Boostrap, Responsive Web Design,
                Mobile First,
                JSON,
                Git,
                CSS3,
                SASS,
                HTML5,
                Visual Studio 2017.
              </Jumbotron>
            </article>
            <hr />
            <ButtonComprar handleComprar={this.handleComprarPassagem} />
          </Col>
        </DivAnimated>
      </div >
    );
  }
}

const welcomeWithRouter = withRouter(Welcome);
const welcomeWithRouterAndAuth = withAuth(welcomeWithRouter);
export default welcomeWithRouterAndAuth;