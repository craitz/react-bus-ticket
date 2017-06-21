import React, { Component } from 'react';
import { connect } from 'react-redux';
import FormPassagem from './FormPassagem';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';

const mapStateToProps = (state) => {
  return {
    cidades: state.compraPassagemState.cidades,
    horarios: state.compraPassagemState.horarios,
    poltronas: state.compraPassagemState.poltronas,
    passagens: state.compraPassagemState.passagens
  };
};

class CompraPassagem extends Component {
  constructor(props) {
    super(props);
    this.canRender = false;
  }

  getDefaults() {
    const { dispatch } = this.props;
    this.canRender = false;

    globals.getCidades().then((cidades) => {
      dispatch(actions.setCidades(cidades));
      globals.getHorarios().then((horarios) => {
        dispatch(actions.setHorarios(horarios));
        dispatch(actions.setPoltronas(globals.getPoltronas()));
        this.canRender = true;
        this.forceUpdate();
      });
    });
  }

  componentDidMount() {
    this.getDefaults();
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;

    if (!this.canRender) {
      return null;
    }

    return (
      <FormPassagem cidades={cidades} horarios={horarios} poltronas={poltronas} />
    );
  }
}

export default connect(mapStateToProps)(CompraPassagem);
