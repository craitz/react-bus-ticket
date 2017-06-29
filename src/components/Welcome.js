import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { BaseField, withInput, withSelect, withDate, withMultiSelect, withInputMask } from '../shared/FormFields';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { withAuth } from '../shared/hoc';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import { Navbar, Nav, NavItem, Glyphicon, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import { withLoading } from '../shared/hoc';
import { setLoading } from '../actions/withLoading.actions';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated'

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/comprar');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    return (
      <div className="welcome-container">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Seja bem-vindo !" glyph="shopping-cart"></NavHeader>
            <Nav pullRight className="hidden-xs hidden-sm">
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Ver histórico de compras" position="top">
                  <FontAwesome className="icon-title links search" name="history" onClick={this.handlePesquisarPassagens} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
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
                JSON,
                Git,
                CSS3,
                SASS,
                HTML5,
                Visual Studio 2017.
              </Jumbotron>
            </article>
            <hr />
            <div className="text-center welcome-button">
              <Button className="btn btn-google-blue" onClick={this.handleComprarPassagem}>
                <Glyphicon className="icon-title links comprar" glyph="shopping-cart" />
                <span className="text-after-icon hidden-xs">Compre agora sua passagem</span>
                <span className="text-after-icon hidden-sm hidden-md hidden-lg">Comprar passagens</span>
              </Button>
            </div>
          </Col>




          {/*<p>
            <h3 class="header2">Detalhes técnicos e ferramentas utilizadas</h3>
            <hr></hr>
            <ul class="header2--list">
              <a href="https://www.javascript.com/" target="_blank">Javascript</a> e as mais novas features do padrão <a href="http://es6-features.org" target="_blank">ECMAScript 6</a>, 
              <a href="https://jquery.com" target="_blank">JQuery</a>, 
              <a href="https://v4-alpha.getbootstrap.com/" target="_blank">Bootstrap 4 Alpha</a>, 
              <a href="https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS3" target="_blank">CSS3</a>, 
              <a href="http://sass-lang.com" target="_blank">SASS</a> CSS preprocessor, 
              <a href="https://www.w3.org/TR/html5/" target="_blank">HTML5</a>, 
              <a href="https://angularjs.org/" target="_blank">AngularJS</a>, com a aplicação estruturada em <a href="https://docs.angularjs.org/guide/component" target="_blank">componentes</a>, introduzidos a partir da versão 1.5, 
              Integração com um backend <a href="https://firebase.google.com" target="_blank">Firebase</a>, numa base de dados do tipo <a href="http://nosql-database.org/" target="_blank">NoSQL</a>, 
              API's do Firebase (<a href="https://firebase.google.com/docs/database/?hl=pt-br" target="_blank">Firebase Reattime Database</a> e <a href="https://firebase.google.com/docs/auth/?hl=pt-br" target="_blank">Firebase Authentication</a>)
                        para as operações na base de dados e autenticação, 
              Uso do <a href="https://www.npmjs.com/" target="_blank">Node Package Manager</a> (npm) para gerenciamento das dependências do projeto, 
              <a href="https://babeljs.io/" target="_blank">Babel</a> transpiler para manutenção da compatibilidade com o padrão ECMAScript 5, 
              <a href="https://webpack.github.io/" target="_blank">Webpack</a> module bundler, 
            </ul>*/}
        </DivAnimated>
      </div >
    );
  }
}

const welcomeWithRouter = withRouter(Welcome);
const welcomeWithRouterAndAuth = withAuth(welcomeWithRouter);
export default welcomeWithRouterAndAuth;