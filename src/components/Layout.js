import React from 'react';
import { Grid, Row, Col, Glyphicon } from 'react-bootstrap';
import logo from '../logo.svg';
import { firebaseHelper } from '../shared/FirebaseHelper';

const Layout = ({ children }) =>
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="header-title">BusTicket</span>
      {firebaseHelper.isLoggedIn() &&
        <span>
          <span className="header-userinfo hidden-xs">{firebaseHelper.getUser().email}</span>
          <Glyphicon glyph="user" className="header-user-logout" />
        </span>
      }
    </div>
    <Grid className="App-container">
      <Row className="App-container__row">
        <Col md={6} mdOffset={3} className="App-container__col">
          {children}
        </Col>
      </Row>
    </Grid>
  </div>

export default Layout;