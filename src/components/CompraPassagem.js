import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormPassagem from './FormPassagem';
import * as actions from '../actions/compraPassagem.actions';

const mapStateToProps = (state) => {
  return {
    cidades: state.compraPassagemState.cidades,
    horarios: state.compraPassagemState.horarios,
    poltronas: state.compraPassagemState.poltronas,
    passagens: state.compraPassagemState.passagens
  };
};

class CompraPassagem extends Component {
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

export default connect(mapStateToProps)(CompraPassagem);
