import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { withAuth } from '../shared/hoc';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

class PerfilUsuario extends Component {
  constructor(props) {
    super(props);
    // this.state = {};
  }

  render() {
    return (
      <div>Novo componente</div>
    );
  }
}

// PerfilUsuario.PropTypes = {}
// PerfilUsuario.defaultProps = {}

const mapStateToProps = (state) => {
  return {
    // cidades: state.compraPassagemState.cidades,
    // horarios: state.compraPassagemState.horarios,
    // poltronas: state.compraPassagemState.poltronas,
    // passagem: state.compraPassagemState.passagem
  };
};

const PerfilUsuarioWithRouter = withRouter(PerfilUsuario);
const PerfilUsuarioWithRouterAndAuth = withAuth(PerfilUsuarioWithRouter);
export default connect(mapStateToProps)(PerfilUsuarioWithRouterAndAuth);
