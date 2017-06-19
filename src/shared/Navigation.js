import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { firebaseHelper } from '../shared/FirebaseHelper';
import TooltipOverlay from '../shared/TooltipOverlay';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';

const NavbarCollapse = ({ email, onLgout }) =>
  <Navbar.Collapse>
    <Nav>
      <NavItem eventKey={1} href="#">Comprar passagens</NavItem>
      <NavItem eventKey={2} href="#">Histórico de compras</NavItem>
    </Nav>
    <Nav pullRight>
      <NavItem eventKey={1} href="#">
        <TooltipOverlay text="Detalhes do usuário">
          <span>{email}</span>
        </TooltipOverlay>
      </NavItem>
      <NavItem eventKey={2} href="#">
        <TooltipOverlay text="Logout">
          <Glyphicon glyph="off" className="logoff-logo" onClick={onLgout} />
        </TooltipOverlay>
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
  }

  handleLogout(event) {
    event.preventDefault();
    firebaseHelper.logout()
      .then(() => {
        this.props.history.push('/login');
      });
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
        {firebaseHelper.isLoggedIn() && <NavbarCollapse email={firebaseHelper.getUser().email} onLgout={this.handleLogout} />}
      </Navbar>
    );
  }
}

export default withRouter(Navigation);