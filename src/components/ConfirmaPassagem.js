import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Jumbotron, Row, Col, Grid } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { withAuth } from '../shared/hoc';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader } from '../shared/PageHeader';
import TooltipOverlay from '../shared/TooltipOverlay';
import Button from 'react-toolbox/lib/button/Button';
import FontAwesome from 'react-fontawesome';
import * as actions from '../actions/modalTrajeto.actions';

class ConfirmaPassagem extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handleHome = this.handleHome.bind(this);
  }

  handleComprarPassagem() {
    this.props.dispatch(actions.setVisible(true, true));
  }

  handleHome() {
    this.props.history.push('/');
  }

  render() {
    const { novaPassagem, novaPassagemVolta, key, keyVolta = null } = this.props.location.state;

    const ButtonContinuarComprando = () =>
      <TooltipOverlay text="Continuar comprando">
        <Button
          floating
          accent
          className="button-continuar-comprando"
          onClick={this.handleComprarPassagem}
          icon={<FontAwesome name="shopping-cart" />}
        />
      </TooltipOverlay>

    return (
      <div className="confirmacao-passagem">
        <PageHeader title="Compra finalizada !" />
        {/*<PageHeader className="visible-xs" title="Sucesso !" />*/}
        <DivAnimated className="form-centered">
          <Grid>
            <Row>
              <Col
                md={keyVolta ? 10 : 8}
                mdOffset={keyVolta ? 1 : 2}
                lg={keyVolta ? 8 : 6}
                lgOffset={keyVolta ? 2 : 3}
                className="text-left">
                <Jumbotron className="jumbo-detalhes mui--z2">
                  <Row className="main-body">
                    <div className="label-localizador">
                      Seu código localizador é:
                  </div>
                    <div className="localizador">
                      {key}
                    </div>
                    <div className="detalhes text-left">
                      <Row>
                        <Col sm={keyVolta ? 6 : 12}>
                          <Jumbotron className="jumbo-ida">
                            <div className="body text-right">
                              <div className="side-ida">
                                <span>IDA</span>
                              </div>
                              <div>
                                <span>{novaPassagem.origem}</span>
                                <i className="material-icons">my_location</i>
                                {/*<FontAwesome name="location-arrow fa-fw icon-after-text" />*/}
                              </div>
                              <div>
                                <span>{novaPassagem.destino}</span>
                                <i className="material-icons">place</i>
                                {/*<FontAwesome name="map-marker fa-fw icon-after-text" />*/}
                              </div>
                              <div>
                                <span>{novaPassagem.data}</span>
                                <i className="material-icons">today</i>
                                {/*<FontAwesome name="calendar fa-fw icon-after-text" />*/}
                              </div>
                              <div>
                                <span>{novaPassagem.horario}</span>
                                <i className="material-icons">alarm</i>
                                {/*<FontAwesome name="clock-o fa-fw icon-after-text" />*/}
                              </div>
                              <div>
                                <span>{novaPassagem.poltrona}</span>
                                <i className="material-icons">airline_seat_recline_extra</i>
                                {/*<FontAwesome name="bookmark fa-fw icon-after-text" />*/}
                              </div>
                            </div>
                          </Jumbotron>
                        </Col>
                        {
                          keyVolta &&
                          <Col sm={6}>
                            <Jumbotron className="jumbo-volta">
                              <div className="body">
                                <div className="side-volta">
                                  <span>VOLTA</span>
                                </div>
                                <div>
                                  <i className="material-icons">place</i>
                                  {/*<FontAwesome name="location-arrow fa-fw" />*/}
                                  <span className="text-after-icon">{novaPassagemVolta.origem}</span>
                                </div>
                                <div>
                                  <i className="material-icons">my_location</i>
                                  {/*<FontAwesome name="map-marker fa-fw" />*/}
                                  <span className="text-after-icon">{novaPassagemVolta.destino}</span>
                                </div>
                                <div>
                                  {/*<FontAwesome name="calendar fa-fw" />*/}
                                  <i className="material-icons">event</i>
                                  <span className="text-after-icon">{novaPassagemVolta.data}</span>
                                </div>
                                <div>
                                  {/*<FontAwesome name="clock-o fa-fw" />*/}
                                  <i className="material-icons">alarm</i>
                                  <span className="text-after-icon">{novaPassagemVolta.horario}</span>
                                </div>
                                <div>
                                  {/*<FontAwesome name="bookmark fa-fw" />*/}
                                  <i className="material-icons">airline_seat_recline_extra</i>
                                  <span className="text-after-icon">{novaPassagemVolta.poltrona}</span>
                                </div>
                              </div>
                            </Jumbotron>
                          </Col>
                        }
                      </Row>
                    </div>
                  </Row>
                  <Row className="bottom-strip">
                    <div className="paragrafo-email">
                      Um e-mail foi enviado para <strong>{novaPassagem.email}</strong> com todos os detalhes da a sua compra.
                  </div>
                    <div className="paragrafo-parabens">Agradecemos a sua preferência e tenha uma ótima viagem!</div>
                  </Row>
                  <ButtonContinuarComprando />
                  {/*<ButtonHome />*/}
                </Jumbotron>
              </Col>
            </Row>
          </Grid>
        </DivAnimated>
      </div>
    );
  }
}

ConfirmaPassagem.PropTypes = {
  novaPassagem: PropTypes.object.isRequired,
  novaPassagemVolta: PropTypes.object.isRequired,
  key: PropTypes.string.isRequired,
  keyVolta: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  return {};
};

const ConfirmaPassagemWithRouter = withRouter(ConfirmaPassagem);
const ConfirmaPassagemWithRouterAndAuth = withAuth(ConfirmaPassagemWithRouter);
export default connect(mapStateToProps)(ConfirmaPassagemWithRouterAndAuth);