import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import FormPassagem from './FormPassagem';
import * as actions from '../actions/compraPassagem.actions';
import { globals } from '../shared/Globals';
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';

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
    this.handleReset = this.handleReset.bind(this);
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

  handleReset() {
    console.log(this.refs.formPassagem);
    // this.formPassagem.reset();
  }

  render() {
    const { cidades, horarios, poltronas } = this.props;

    if (!this.canRender) {
      return null;
    }

    return (
      <div className="comprar-passagem-container">
        <Navbar>
          <Nav>
            <NavItem>
              <Glyphicon className="icon-title" glyph="tags" />
              <span className="page-title">Compre sua passsagem</span>
            </NavItem>
          </Nav>
          <Nav pullRight>
            <TooltipOverlay text="Ver histórico de compras">
              <NavItem href="#">
                <Glyphicon className="icon-title" glyph="search" />
              </NavItem>
            </TooltipOverlay>
            <TooltipOverlay text="Limpar campos">
              <NavItem href="#" onClick={this.handleReset}>
                <Glyphicon className="icon-title" glyph="erase" />
              </NavItem>
            </TooltipOverlay>
          </Nav>
        </Navbar>
        <FormPassagem
          ref="formPassagem"
          cidades={cidades}
          horarios={horarios}
          poltronas={poltronas} />
      </div>
    );
  }
}

export default connect(mapStateToProps)(CompraPassagem);
