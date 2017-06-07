import React, { Component } from 'react';
import logo from './logo.svg';
import { Grid, Row, Col } from 'react-bootstrap';
import FormPassagem from './FormPassagem.js';
import './App.css';

const Container = ({ children }) =>
  <Grid className="App-container">
    <Row>
      <Col md={6} mdOffset={3}>
        {children}
      </Col>
    </Row>
  </Grid>


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to BusTicket</h2>
        </div>
        <Container>
          <FormPassagem></FormPassagem>
        </Container>
      </div>
    );
  }
}

export default App;
