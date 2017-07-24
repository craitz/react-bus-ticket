import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { firebaseHelper } from '../shared/FirebaseHelper';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button } from 'muicss/react';

export const NavHeader = ({ label, glyph }) =>
  <Nav className="navheader-nav">
    <NavItem>
      <span className="page-title">{label}</span>
    </NavItem>
  </Nav>

NavHeader.PropTypes = {
  label: PropTypes.string.isRequired,
  glyph: PropTypes.string.isRequired
}

const NavbarCollapse = ({ email, onLgout, onComprarPassagem, onPesquisarPassagens, onHome, onPerfilUsuario }) =>
  <Navbar.Collapse>
    <Nav>
      <NavItem href="#" onClick={onHome}>
        <FontAwesome name="home"></FontAwesome>
        <span className="text-after-icon hidden-sm">Home</span>
      </NavItem>
      <NavItem href="#" onClick={onComprarPassagem}>
        <FontAwesome name="shopping-cart"></FontAwesome>
        <span className="text-after-icon hidden-sm">Comprar</span>
      </NavItem>
      <NavItem href="#" onClick={onPesquisarPassagens}>
        <FontAwesome name="history"></FontAwesome>
        <span className="text-after-icon hidden-sm">Histórico</span>
      </NavItem>
    </Nav>
    <Navbar.Text className="nav-fontes">
      <Navbar.Link href="https://github.com/craitz/react-bus-ticket" target="_blank">
        <FontAwesome name="github"></FontAwesome>
        <span className="text-after-icon hidden-sm">Código-fonte</span>
      </Navbar.Link>
    </Navbar.Text>
    <Nav pullRight className="nav-user">
      <NavItem href="#" onClick={onPerfilUsuario}>
        <FontAwesome name="user"></FontAwesome>
        <span className="text-after-icon hidden-sm hidden-md">{email}</span>
      </NavItem>
      <NavItem href="#" onClick={onLgout}>
        <FontAwesome name="power-off"></FontAwesome>
        <span className="text-after-icon hidden-sm hidden-md">Sair</span>
      </NavItem>
    </Nav>
  </Navbar.Collapse>

// <Button
//   color="danger"
//   variant="fab"
//   onClick={onLgout}
//   className="btn-logout">
//   <FontAwesome name="power-off"></FontAwesome>
// </Button>



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
    this.handleHome = this.handleHome.bind(this);
    this.handlePerfilUsuario = this.handlePerfilUsuario.bind(this);
  }

  handleLogout(event) {
    event.preventDefault();
    firebaseHelper.signOut()
      .then(() => {
        this.props.history.push('/login');
      });
  }

  handlePerfilUsuario(event) {
    event.preventDefault();
    this.props.history.push('/perfil');
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/comprar');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  handleHome(event) {
    event.preventDefault();
    this.props.history.push('/');
  }

  render() {
    const navBrandClass = firebaseHelper.isLoggedIn() ? 'navbrand-login' : 'navbrand-logout';
    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand className={navBrandClass}>
            <FontAwesome name="bus" className="App-logo"></FontAwesome>
            <span className="header-title">BusTicket</span>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {
          firebaseHelper.isLoggedIn() &&
          <NavbarCollapse
            email={firebaseHelper.getUserEmail()}
            onLgout={this.handleLogout}
            onComprarPassagem={this.handleComprarPassagem}
            onPesquisarPassagens={this.handlePesquisarPassagens}
            onHome={this.handleHome}
            onPerfilUsuario={this.handlePerfilUsuario}
          />
        }
      </Navbar>
    );
  }
}

export default withRouter(Navigation);