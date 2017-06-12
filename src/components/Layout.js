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
      <Row>
        <Col md={6} mdOffset={3}>
          {children}
        </Col>
      </Row>
    </Grid>
  </div>

export default Layout;