import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { withAuth } from '../shared/hoc';
import { Table, NavItem, Glyphicon, Navbar, Nav } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import * as actions from '../actions/pesquisaPassagens.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
// import PropTypes from 'prop-types';

class PesquisaPassagens extends Component {
  componentWillMount() {
    const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUser().email);
    console.log(emailFirebase);
    const ref = `passagens/${emailFirebase}`;

    firebaseHelper.fetch(ref).then((passagens) => {
      this.props.dispatch(actions.setPassagens(passagens));
      console.log(passagens);
    });
  }

  render() {
    return (
      <div className="pesquisar-passagens-container">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Histórico de passagens" glyph="tags"></NavHeader>
            <Nav pullRight>
              <NavItem href="/passagens">
                <TooltipOverlay text="Comprar passagem" position="top">
                  <Glyphicon className="icon-title links search" glyph="shopping-cart" />
                </TooltipOverlay>
              </NavItem>
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Limpar campos" position="top">
                  <Glyphicon className="icon-title links reset" glyph="erase" onClick={this.handleReset} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <Table responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Table heading</th>
              <th>Table heading</th>
              <th>Table heading</th>
              <th>Table heading</th>
              <th>Table heading</th>
              <th>Table heading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
              <td>Table cell</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

// PesquisaPassagens.PropTypes = {}
// PesquisaPassagens.defaultProps = {}

const mapStateToProps = (state) => {
  return {
    passagens: state.pesquisaPassagensState.passagens,
  };
};

const PesquisaPassagensWithRouter = withRouter(PesquisaPassagens);
const PesquisaPassagensWithRouterAndAuth = withAuth(PesquisaPassagensWithRouter);
export default connect(mapStateToProps)(PesquisaPassagensWithRouterAndAuth);
