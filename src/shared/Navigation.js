import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { firebaseHelper } from '../shared/FirebaseHelper';
import TooltipOverlay from '../shared/TooltipOverlay';
import { withRouter, Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { resetFormPassagem } from '../actions/compraPassagem.actions'
import FontAwesome from 'react-fontawesome';

export const NavHeader = ({ label, glyph }) =>
  <Nav>
    <NavItem>
      {/*<FontAwesome className="icon-title" size="3x" name={glyph}></FontAwesome>*/}
      <span className="page-title">{label}</span>
    </NavItem>
  </Nav>

NavHeader.PropTypes = {
  label: PropTypes.string.isRequired,
  glyph: PropTypes.string.isRequired
}

const NavbarCollapse = ({ email, onLgout, onComprarPassagem, onPesquisarPassagens }) =>
  <Navbar.Collapse>
    <Nav>
      <NavItem href="#" onClick={onComprarPassagem}>
        <FontAwesome name="shopping-cart"></FontAwesome>
        <span className="text-after-icon">Comprar passagens</span>
      </NavItem>
      <NavItem href="#" onClick={onPesquisarPassagens}>
        <FontAwesome name="history"></FontAwesome>
        <span className="text-after-icon">Histórico de compras</span>
      </NavItem>
    </Nav>
    <Navbar.Text>
      <Navbar.Link href="https://github.com/craitz/react-bus-ticket" target="_blank">
        <FontAwesome name="github"></FontAwesome>
        <span className="text-after-icon">Código-fonte</span>
      </Navbar.Link>
    </Navbar.Text>
    <Nav pullRight>
      <NavItem href="#">
        <FontAwesome name="user"></FontAwesome>
        <span className="text-after-icon">{email}</span>
      </NavItem>
      <NavItem href="#" onClick={onLgout}>
        <FontAwesome name="power-off"></FontAwesome>
        <span className="text-after-icon">Sair</span>
      </NavItem>
    </Nav>
  </Navbar.Collapse>

NavbarCollapse.PropTypes = {
  email: PropTypes.string.isRequired,
  onLgout: PropTypes.func
}

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
  }

  handleLogout(event) {
    event.preventDefault();
    firebaseHelper.logout()
      .then(() => {
        this.props.history.push('/login');
      });
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <FontAwesome name="bus" className="App-logo"></FontAwesome>
            <span className="header-title">BusTicket</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {
          firebaseHelper.isLoggedIn() &&
          <NavbarCollapse
            email={firebaseHelper.getUser().email}
            onLgout={this.handleLogout}
            onComprarPassagem={this.handleComprarPassagem}
            onPesquisarPassagens={this.handlePesquisarPassagens}
          />
        }
      </Navbar>
    );
  }
}

export default withRouter(Navigation);