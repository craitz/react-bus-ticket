import React, { Component } from 'react';
import * as firebase from 'firebase';
import logo from './logo.svg';
import { Grid, Row, Col } from 'react-bootstrap';
import FormPassagem from './FormPassagem.js';
import { SequenceArray } from './shared/Utils.js';
import './App.css';

const Container = ({ children }) => <Grid className="App-container">
  <Row>
    <Col md={6} mdOffset={3}>
      {children}
    </Col>
  </Row>
</Grid>

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cidades: [],
      horarios: [],
      poltronas: []
    };

  }

  componentDidMount() {
    const rootRef = firebase
      .database()
      .ref();
    const cidadesRef = rootRef.child('cidades');
    const horariosRef = rootRef.child('horarios');

    cidadesRef.on('value', snap => {
      this.setState({
        cidades: snap.val()
      });
    });

    horariosRef.on('value', snap => {
      this.setState({
        horarios: snap.val()
      });
    });

    this.setState({ poltronas: new SequenceArray(42) });
  }

  render() {
    const { cidades, horarios, poltronas } = this.state;

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

export default App;
