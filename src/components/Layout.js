import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import logo from '../logo.svg';

const Layout = ({ children }) =>
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Welcome to BusTicket</h2>
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