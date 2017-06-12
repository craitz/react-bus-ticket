import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormPassagem from './components/FormPassagem';
import * as actions from './actions/app.actions';

const mapStateToProps = (state) => {
  return {
    cidades: state.appState.cidades,
    horarios: state.appState.horarios,
    poltronas: state.appState.poltronas,
    passagens: state.appState.passagens
  };
};

class App extends Component {
  componentDidMount() {
    this.props.dispatch(actions.fetchCidades());
    this.props.dispatch(actions.fetchHorarios());
    this.props.dispatch(actions.fetchPoltronas());
    this.props.dispatch(actions.fetchPassagens());
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;

    // it will only render when firebase finish fetch data
    if ((!cidades || cidades.length === 0) || (!horarios || horarios.length === 0))
      return null;

    return (
      <FormPassagem cidades={cidades} horarios={horarios} poltronas={poltronas} />
    );
  }
}

export default connect(mapStateToProps)(App);
