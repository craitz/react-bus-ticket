import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Jumbotron, Row, Col, Grid, Label } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { withAuth } from '../shared/hoc';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';
import TooltipOverlay from '../shared/TooltipOverlay';
import Button from 'react-toolbox/lib/button/Button';
import FontAwesome from 'react-fontawesome';

class ConfirmaPassagem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { novaPassagem, novaPassagemVolta, key, keyVolta } = this.props.location.state;

    const ButtonContinuarComprando = () =>
      <TooltipOverlay text="Continuar comprando" position="top">
        <Button
          floating
          accent
          className="button-continuar-comprando"
          //onClick={isVolta ? this.handleLimpaVolta : this.handleLimpaIda}
          icon={<FontAwesome name="shopping-cart" />}
        />
      </TooltipOverlay>

    const ButtonHome = () =>
      <TooltipOverlay text="Ir para página inicial" position="top">
        <Button
          floating
          accent
          mini
          className="button-home"
          //onClick={isVolta ? this.handleLimpaVolta : this.handleLimpaIda}
          icon={<FontAwesome name="home" />}
        />
      </TooltipOverlay>

    return (
      <div className="confirmacao-passagem">
        <PageHeader title="Compra finalizada !">
        </PageHeader>
        <DivAnimated className="form-centered">
          <Grid>
            <Row>
              <Col md={10} mdOffset={1} lg={8} lgOffset={2} className="text-left">
                <Jumbotron className="jumbo-detalhes">
                  <div className="label-localizador">
                    Seu código localizador é:
                  </div>
                  <div className="localizador">
                    {key}
                  </div>
                  {/*<div><strong>Nome:</strong> {novaPassagem.nome}</div>
                  <div><strong>CPF:</strong> {novaPassagem.cpf}</div>*/}
                  <div className="detalhes text-left">
                    <Row>
                      <Col sm={6}>
                        <Jumbotron className="jumbo-ida mui--z2">
                          {/*<div className="header" />*/}
                          <div className="body text-right">
                            <div><strong>De:</strong> {novaPassagem.origem}</div>
                            <div><strong>Para:</strong> {novaPassagem.destino}</div>
                            <div><strong>Data:</strong> {novaPassagem.data}</div>
                            <div><strong>Saída:</strong> {novaPassagem.horario}</div>
                            <div><strong>Poltrona(s):</strong> {novaPassagem.poltrona}</div>
                          </div>
                          {/*<div className="footer" />*/}
                        </Jumbotron>
                      </Col>
                      <Col sm={6}>
                        <Jumbotron className="jumbo-volta mui--z2">
                          {/*<div className="header" />*/}
                          <div className="body">
                            <div><strong>De:</strong> {novaPassagem.origem}</div>
                            <div><strong>Para:</strong> {novaPassagem.destino}</div>
                            <div><strong>Data:</strong> {novaPassagem.data}</div>
                            <div><strong>Saída:</strong> {novaPassagem.horario}</div>
                            <div><strong>Poltrona(s):</strong> {novaPassagem.poltrona}</div>
                          </div>
                          {/*<div className="footer" />*/}
                        </Jumbotron>
                      </Col>
                    </Row>
                  </div>
                  <div className="paragrafo-email">
                    Um e-mail foi enviado para <strong>{novaPassagem.email}</strong> com todos os detalhes da a sua compra.
                  </div>
                  <div className="paragrafo-parabens">Agradecemos a sua preferência e tenha uma ótima viagem!</div>
                  <ButtonContinuarComprando />
                  <ButtonHome />
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