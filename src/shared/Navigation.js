import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { firebaseHelper } from '../shared/FirebaseHelper';
import TooltipOverlay from '../shared/TooltipOverlay';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import { resetFormPassagem } from '../actions/compraPassagem.actions'

export const NavHeader = ({ label, glyph }) =>
  <Nav>
    <NavItem>
      <Glyphicon className="icon-title" glyph={glyph} />
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
        <span>Comprar passagens</span>
      </NavItem>
      <NavItem href="#" onClick={onPesquisarPassagens}>
        <span>Histórico de compras</span>
      </NavItem>
    </Nav>
    <Nav pullRight>
      <TooltipOverlay text="Detalhes do usuário">
        <NavItem href="#">
          <span>{email}</span>
        </NavItem>
      </TooltipOverlay>
      <TooltipOverlay text="Logout">
        <NavItem href="#" onClick={onLgout}>
          <Glyphicon glyph="off" className="logoff-logo" />
        </NavItem>
      </TooltipOverlay>
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
            <Glyphicon glyph="time" className="App-logo" />
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