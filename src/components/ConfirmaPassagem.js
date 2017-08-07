import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Jumbotron, Row, Col, Grid, Label } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { withAuth } from '../shared/hoc';
import DivAnimated from '../shared/DivAnimated'
import { PageHeader, PageHeaderItem } from '../shared/PageHeader';

class ConfirmaPassagem extends Component {
  constructor(props) {
    super(props);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.handlePesquisarPassagens = this.handlePesquisarPassagens.bind(this);
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    this.props.history.push('/comprar');
  }

  handlePesquisarPassagens(event) {
    event.preventDefault();
    this.props.history.push('/passagens');
  }

  render() {
    const { novaPassagem, novaPassagemVolta, key, keyVolta } = this.props.location.state;
    return (
      <div className="confirmacao-passagem">
        <PageHeader title="Compra finalizada !">
          <PageHeaderItem tooltip="Ver histórico de compras" glyph="history" onClick={this.handlePesquisarPassagens} />
          <PageHeaderItem tooltip="Comprar nova passagem" glyph="shopping-cart" onClick={this.handleComprarPassagem} />
        </PageHeader>
        <DivAnimated className="form-centered">
          <Grid>
            <Row>
              <Col sm={8} smOffset={2} md={6} mdOffset={3} lg={4} lgOffset={4} className="text-left">
                {/*<Jumbotron className="jumbo-detalhes">*/}
                <div className="label-localizador">Seu código localizador é:</div>
                <div className="localizador">{key}</div>
                <div className="detalhes text-left">
                  <Jumbotron className="jumbo-ida mui--z3">
                    <header className="header"></header>
                    <body className="body">
                      <div><strong>Nome:</strong> {novaPassagem.nome}</div>
                      <div><strong>CPF:</strong> {novaPassagem.cpf}</div>
                      <div><strong>Origem:</strong> {novaPassagem.origem}</div>
                      <div><strong>Destino:</strong> {novaPassagem.destino}</div>
                      <div><strong>Data:</strong> {novaPassagem.data}</div>
                      <div><strong>Saída:</strong> {novaPassagem.horario}</div>
                      <div><strong>Poltrona(s):</strong> {novaPassagem.poltrona}</div>
                    </body>
                    <footer className="footer"></footer>
                  </Jumbotron>
                  <Jumbotron className="jumbo-volta mui--z3">
                    <header className="header"></header>
                    <body className="body">
                      <div><strong>Nome:</strong> {novaPassagem.nome}</div>
                      <div><strong>CPF:</strong> {novaPassagem.cpf}</div>
                      <div><strong>Origem:</strong> {novaPassagem.origem}</div>
                      <div><strong>Destino:</strong> {novaPassagem.destino}</div>
                      <div><strong>Data:</strong> {novaPassagem.data}</div>
                      <div><strong>Saída:</strong> {novaPassagem.horario}</div>
                      <div><strong>Poltrona(s):</strong> {novaPassagem.poltrona}</div>
                    </body>
                    <footer className="footer"></footer>
                  </Jumbotron>
                </div>
                <div className="paragrafo-email">
                  Um e-mail foi enviado para <strong>{novaPassagem.email}</strong> com todos os detalhes da a sua compra.
                </div>
                <div className="paragrafo-parabens">Agradecemos a sua preferência e tenha uma ótima viagem !</div>
                {/*</Jumbotron>*/}
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