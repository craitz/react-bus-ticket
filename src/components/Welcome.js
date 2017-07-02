import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { Navbar, Nav, NavItem, Glyphicon, Col, Button, Jumbotron } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import FontAwesome from 'react-fontawesome';
import DivAnimated from '../shared/DivAnimated'

export const ButtonComprar = ({handleComprar}) =>
  <div className="text-center welcome-button">
    <Button className="btn btn-google-blue" onClick={handleComprar}>
      <Glyphicon className="icon-title links comprar" glyph="shopping-cart" />
      <span className="text-after-icon hidden-xs">Compre agora sua passagem</span>
      <span className="text-after-icon hidden-sm hidden-md hidden-lg">Comprar passagens</span>
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
            <ButtonComprar handleComprar={this.handleComprarPassagem}/>
          </Col>
        </DivAnimated>
      </div >
    );
  }
}

const welcomeWithRouter = withRouter(Welcome);
const welcomeWithRouterAndAuth = withAuth(welcomeWithRouter);
export default welcomeWithRouterAndAuth;