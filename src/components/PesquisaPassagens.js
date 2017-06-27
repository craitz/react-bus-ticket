import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { withAuth } from '../shared/hoc';
import { Table, NavItem, Glyphicon, Navbar, Nav, Label, Col, FormControl } from 'react-bootstrap';
import TooltipOverlay from '../shared/TooltipOverlay';
import { NavHeader } from '../shared/Navigation';
import * as actions from '../actions/pesquisaPassagens.actions';
import { firebaseHelper } from '../shared/FirebaseHelper';
import * as utils from '../shared/Utils';
import { resetFormPassagem } from '../actions/compraPassagem.actions'

const Consulta = {
  sort: {
    field: '',
    direction: true
  },
  filter: {
    nome: '',
    compra: '',
    linha: '',
    saida: '',
    poltrona: ''
  }
}

const getGlyph = (field) => {
  const { sort } = Consulta;
  if (sort.field === field) {
    return (
      <Glyphicon
        glyph={(sort.direction) ? "sort-by-attributes" : "sort-by-attributes-alt"}
        className="th-icon"
      />
    );
  } else {
    return null;
  }
}

const TableHeader = ({ className, label, onClick, field }) =>
  <th className={className}>
    <span onClick={onClick}>{label}</span>
    {getGlyph(field)}
  </th>


const TableColFilter = ({ tooltip, value, onChange }) =>
  <td>
    <TooltipOverlay text={tooltip} position="top">
      <FormControl value={value} onChange={onChange} />
    </TooltipOverlay>
  </td>

class PesquisaPassagens extends Component {
  constructor(props) {
    super(props);
    this.handleClickNome = this.handleClickNome.bind(this);
    this.handleClickDataCompra = this.handleClickDataCompra.bind(this);
    this.handleClickLinha = this.handleClickLinha.bind(this);
    this.handleClickSaida = this.handleClickSaida.bind(this);
    this.handleChangeFilterNome = this.handleChangeFilterNome.bind(this);
    this.handleChangeFilterDataCompra = this.handleChangeFilterDataCompra.bind(this);
    this.handleChangeFilterLinha = this.handleChangeFilterLinha.bind(this);
    this.handleChangeFilterSaida = this.handleChangeFilterSaida.bind(this);
    this.handleChangeFilterPoltrona = this.handleChangeFilterPoltrona.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleComprarPassagem = this.handleComprarPassagem.bind(this);
    this.passagensBackup = [];
  }

  componentWillMount() {
    const emailFirebase = utils.emailToFirebaseKey(firebaseHelper.getUser().email);
    const ref = `passagens/${emailFirebase}`;

    this.handleReset();

    firebaseHelper.fetch(ref).then((passagens) => {
      const arr = utils.objToArray(passagens);
      this.passagensBackup = utils.arrayDeepCopy(arr);
      this.props.dispatch(actions.setPassagens(arr));
      this.forceUpdate();
    });
  }

  handleReset() {
    const { sort, filter } = Consulta;

    sort.field = '';
    sort.direction = true;
    filter.nome = '';
    filter.compra = '';
    filter.linha = '';
    filter.saida = '';
    filter.poltrona = '';

    this.props.dispatch(actions.setPassagens(utils.arrayDeepCopy(this.passagensBackup)));
  }

  handleComprarPassagem(event) {
    event.preventDefault();
    // this.props.dispatch(resetFormPassagem());
    this.props.history.push('/');
  }

  aplicaPesqusia() {
    this.props.dispatch(actions.setPassagens(this.filtraPassagens(this.sortByField())));
  }

  sortByField() {
    const { sort } = Consulta;
    const passagensOrdenadas = utils.arrayDeepCopy(this.passagensBackup);

    passagensOrdenadas.sort((a, b) => {
      let objA = '';
      let objB = '';

      switch (sort.field) {
        case utils.PesquisaPassagensField.LINHA: {
          objA = a.origem.concat(a.destino);
          objB = b.origem.concat(b.destino);
          break;
        }
        case utils.PesquisaPassagensField.SAIDA: {
          objA = utils.buildIsoDate(a.data, a.horario);
          objB = utils.buildIsoDate(b.data, b.horario);
          break;
        }
        case utils.PesquisaPassagensField.COMPRA: {
          objA = a.dataCompra;
          objB = b.dataCompra;
          break;
        }
        case utils.PesquisaPassagensField.NOME: {
          objA = a.nome;
          objB = b.nome;
          break;
        }
        default: {
        }
      }

      if (sort.direction) {
        if (objA > objB) {
          return 1;
        }
        if (objA < objB) {
          return -1;
        }
        return 0;
      } else {
        if (objA < objB) {
          return 1;
        }
        if (objA > objB) {
          return -1;
        }
        return 0;
      }
    });

    return passagensOrdenadas;
  }

  handleClickNome(event) {
    const { sort } = Consulta;
    if (sort.field === utils.PesquisaPassagensField.NOME) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.NOME;
      sort.direction = true;
    }

    this.aplicaPesqusia();
  }

  handleClickDataCompra(event) {
    const { sort } = Consulta;
    if (sort.field === utils.PesquisaPassagensField.COMPRA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.COMPRA;
      sort.direction = true;
    }

    this.aplicaPesqusia();
  }

  handleClickLinha(event) {
    const { sort } = Consulta;
    if (sort.field === utils.PesquisaPassagensField.LINHA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.LINHA;
      sort.direction = true;
    }

    this.aplicaPesqusia();
  }

  handleClickSaida(event) {
    const { sort } = Consulta;
    if (sort.field === utils.PesquisaPassagensField.SAIDA) {
      sort.direction = !sort.direction;
    } else {
      sort.field = utils.PesquisaPassagensField.SAIDA;
      sort.direction = true;
    }

    this.aplicaPesqusia();
  }

  handleChangeFilterNome(event) {
    const { filter } = Consulta;
    const value = event.target.value.toLowerCase();

    filter.nome = value;

    this.aplicaPesqusia();
  }

  handleChangeFilterDataCompra(event) {
    const { filter } = Consulta;
    const value = event.target.value;

    filter.compra = value;

    this.aplicaPesqusia();
  }

  handleChangeFilterLinha(event) {
    const { filter } = Consulta;
    const value = event.target.value.toLowerCase();

    filter.linha = value;

    this.aplicaPesqusia();
  }

  handleChangeFilterSaida(event) {
    const { filter } = Consulta;
    const value = event.target.value;

    filter.saida = value;

    this.aplicaPesqusia();
  }

  handleChangeFilterPoltrona(event) {
    const { filter } = Consulta;
    const value = event.target.value;

    filter.poltrona = value;

    this.aplicaPesqusia();
  }

  filtraPassagens(passagensComOrdenacao) {
    const { filter } = Consulta;
    const passagensFiltradas = passagensComOrdenacao.filter((passagem) => {
      const nome = passagem.nome.toLowerCase();
      const compra = passagem.dataCompra;
      const saida = passagem.data.concat(passagem.horario);
      const linha = passagem.origem.toLowerCase().concat(passagem.destino.toLowerCase());
      const poltronas = passagem.poltrona.split(' - ');
      let include = true;

      if (filter.nome.length > 0) {
        include = include && (nome.includes(filter.nome));
      }

      if (filter.compra.length > 0) {
        include = include && (compra.includes(filter.compra));
      }

      if (filter.linha.length > 0) {
        include = include && (linha.includes(filter.linha));
      }

      if (filter.saida.length > 0) {
        include = include && (saida.includes(filter.saida));
      }

      if (filter.poltrona.length > 0) {
        const poltronasFiltro = filter.poltrona.split(',');

        include = include &&
          poltronas.find((poltrona) => {
            return poltronasFiltro.includes(poltrona);
          });
      }

      return include;
    });

    return passagensFiltradas;
  }

  render() {
    const { passagens } = this.props;
    const { filter } = Consulta;
    const fields = utils.PesquisaPassagensField;

    // console.log('render >>> ', passagens);
    return (
      <div className="pesquisar-passagens-container">
        <div className="navheader-container">
          <Navbar>
            <NavHeader label="Histórico de passagens" glyph="tags"></NavHeader>
            <Nav pullRight>
              <NavItem href="/passagens">
                <TooltipOverlay text="Comprar passagem" position="top">
                  <Glyphicon className="icon-title links comprar" glyph="shopping-cart" onClick={this.handleComprarPassagem} />
                </TooltipOverlay>
              </NavItem>
              <NavItem href="#" className="nav-links">
                <TooltipOverlay text="Limpar filtros" position="top">
                  <Glyphicon className="icon-title links reset" glyph="erase" onClick={this.handleReset} />
                </TooltipOverlay>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        <Col md={10} mdOffset={1}>
          <Table responsive hover className="animated bounceInLeft">
            <thead>
              <tr>
                <TableHeader
                  className="th-nome"
                  onClick={this.handleClickNome}
                  label="Nome"
                  field={fields.NOME}
                />
                <TableHeader
                  className="th-data-compra"
                  onClick={this.handleClickDataCompra}
                  label="Data da compra"
                  field={fields.COMPRA}
                />
                <TableHeader
                  className="th-linha"
                  onClick={this.handleClickLinha}
                  label="Linha"
                  field={fields.LINHA}
                />
                <TableHeader
                  className="th-saida"
                  onClick={this.handleClickSaida}
                  label="Saída"
                  field={fields.SAIDA}
                />
                <th>Poltrona(s)</th>
              </tr>
            </thead>
            <tbody className="text-left">
              <tr>
                <TableColFilter
                  tooltip="Pesquisar pelo nome"
                  value={filter.nome}
                  onChange={this.handleChangeFilterNome}
                />
                <TableColFilter
                  tooltip="Pesquisar pela data da compra da passagem"
                  value={filter.compra}
                  onChange={this.handleChangeFilterDataCompra}
                />
                <TableColFilter
                  tooltip="Pesquisar pela origem e destino da viagem"
                  value={filter.linha}
                  onChange={this.handleChangeFilterLinha}
                />
                <TableColFilter
                  tooltip="Pesquisar pela data e horário de saída"
                  value={filter.saida}
                  onChange={this.handleChangeFilterSaida}
                />
                <TableColFilter
                  tooltip="Pesquisar por poltrona(s). Se necessário, separe por vírgulas"
                  value={filter.poltrona}
                  onChange={this.handleChangeFilterPoltrona}
                />
              </tr>
              {passagens.map((value, index) =>
                <tr key={index}>
                  <td>
                    {value.nome}
                  </td>
                  <td>
                    {value.dataCompra}
                  </td>
                  <td>
                    <span>{value.origem}</span>
                    <Glyphicon glyph="arrow-right" className="icon-table arrow-trajeto" />
                    <span>{value.destino}</span>
                  </td>
                  <td>
                    <Glyphicon glyph="calendar" className="icon-table data" />
                    <span>{value.data}</span>
                    <Glyphicon glyph="time" className="icon-table horario" />
                    <span>{value.horario}</span>
                  </td>
                  <td>
                    {value.poltrona.split(' - ').map((value, index) =>
                      <Label key={index} bsStyle="danger" className="label-poltrona">{value}</Label>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    passagens: state.pesquisaPassagensState.passagens,
  };
};

const PesquisaPassagensWithRouter = withRouter(PesquisaPassagens);
const PesquisaPassagensWithRouterAndAuth = withAuth(PesquisaPassagensWithRouter);
export default connect(mapStateToProps)(PesquisaPassagensWithRouterAndAuth);
