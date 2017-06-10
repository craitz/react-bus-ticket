import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import { Grid, Row, Col } from 'react-bootstrap';
import FormPassagem from './components/FormPassagem.js';
import { fetchCidades, fetchHorarios, fetchPoltronas } from './actions/listasActions.js';

import './App.css';

const mapStateToProps = (state) => {
  return {
    cidades: state.listas.cidades,
    horarios: state.listas.horarios,
    poltronas: state.listas.poltronas
  };
};

const Container = ({ children }) => <Grid className="App-container">
  <Row>
    <Col md={6} mdOffset={3}>
      {children}
    </Col>
  </Row>
</Grid>

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchCidades());
    this.props.dispatch(fetchHorarios());
    this.props.dispatch(fetchPoltronas());
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;

    // it will only render when firebase finish fetch data
    if ((!cidades || cidades.length === 0) || (!horarios || horarios.length === 0))
      return null;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to BusTicket</h2>
        </div>
        <Container>
          <FormPassagem cidades={cidades} horarios={horarios} poltronas={poltronas} />
        </Container>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
