import React, { Component } from 'react';
import * as utils from '../shared/Utils';
import { Panel, Accordion, ProgressBar } from 'react-bootstrap';
import BusSelect from './BusSelect';
import store from '../store';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import checkLogo from '../styles/images/check3.svg';
import removeLogo from '../styles/images/remove.svg';
import clockLogo from '../styles/images/clock2.svg';
import TooltipOverlay from '../shared/TooltipOverlay';
import FontAwesome from 'react-fontawesome';
import Spinner from 'react-spinner-children';

class HorariosAccordion extends Component {
  constructor(props) {
    super(props);
    this.onClickPanel = this.onClickPanel.bind(this);
  }

  getLotacao(ocupadas, size) {
    const breakpoint = size / 3;
    if (ocupadas === 0) {
      return {
        status: 'info',
        icon: 'battery-0'
      }
    } else if (ocupadas < breakpoint) {
      return {
        status: 'success',
        icon: 'battery-1'
      }
    } else if (ocupadas < breakpoint * 2) {
      return {
        status: '',
        icon: 'battery-2'
      }
    } else if (ocupadas < breakpoint * 3) {
      return {
        status: 'warning',
        icon: 'battery-3'
      }
    } else {
      return {
        status: 'danger',
        icon: 'battery-4'
      }
    }
  }

  onClickPanel(selected, event, isDisabled) {
    const className = event.target.className;
    const saveOrRemoveClicked = className.includes('icon-save') || className.includes('icon-remove');
    const arrowClicked = className.includes('icon-arrow');

    // se o panel está desabilitado, não faz nada
    // se clicou no ícone de salvar ou remover, também não faz nada
    // pois o panel não deve ser fechado nessas operações
    if (isDisabled || saveOrRemoveClicked) {
      return;
    }

    if (arrowClicked) {
      const { isVolta, active } = this.props;
      const selectedAccordion = (active === selected) ? -1 : selected;

      !isVolta && store.dispatch(compraPassagemActions.setActiveAccordion(selectedAccordion));
      isVolta && store.dispatch(compraPassagemActions.setActiveAccordionVolta(selectedAccordion));
    }
  }

  buildCollapsibles() {
    const { horarios, onClickSeat, onResetSeats, onSaveSeats, isVolta, isSavingPoltronas,
      active } = this.props;
    const collapsibles = [];

    // sort horários
    const arr = Object.keys(horarios);
    arr.sort();

    const customSpinConfig = {
      lines: 10,
      rotate: 17
    };

    // itera no array e cria os collapsibles
    arr.map((horario, index) => {
      const poltronas = horarios[horario];
      const allSize = Object.keys(poltronas).length - 1;
      const ocupadasSize = [...Object.keys(poltronas)]
        .filter(item => poltronas[item] === utils.PoltronaStatus.RESERVED).length;
      const percentLotacao = parseInt((ocupadasSize / allSize) * 100, 10);
      const strLotacao = `${ocupadasSize.toString().padStart(2, '0')}/${allSize}`;
      const strHorario = utils.firebaseToTimeExt(horario);
      const position = (index + 1);
      const className = poltronas.isDisabled ? "not-allowed" : "allowed";
      const isActive = (position === active);


      //  eventKey={poltronas.isDisabled ? -1 : position}
      collapsibles.push(
        <Panel
          className={className}
          key={horario}
          eventKey={position}
          onSelect={(selected, e) => this.onClickPanel(selected, e, poltronas.isDisabled)}
          bsStyle="default"
          header={
            <div>
              <span className="trigger-left">
                <img
                  src={clockLogo}
                  height="24"
                  alt=""
                  className="horario-icon"
                />
                {
                  (strHorario.length > 0) &&
                  <span className="text-after-icon text-horario text-left">{strHorario}</span>
                }
              </span>
              <span className="trigger-right">
                <TooltipOverlay
                  text="Salvar seleção"
                  position="top">
                  <img
                    src={checkLogo}
                    height="15"
                    alt=""
                    className="icon-save icon-after-text"
                    onClick={(event) => onSaveSeats(event, isVolta, horario)}
                  />
                </TooltipOverlay>
                <TooltipOverlay
                  text="Limpar seleção"
                  position="top">
                  <img
                    src={removeLogo}
                    height="15"
                    alt=""
                    className="icon-remove"
                    onClick={() => onResetSeats(isVolta, horario)}
                  />
                </TooltipOverlay>
                <FontAwesome name="bookmark" className="icon-passenger hidden-xs" />
                <span className="text-after-icon poltronas-text hidden-xs">
                  {strLotacao}
                </span>
                <ProgressBar
                  className={percentLotacao ? "full hidden-xs" : "empty hidden-xs"}
                  bsStyle="success"
                  now={percentLotacao}
                />
                <FontAwesome name={isActive ? "chevron-circle-up" : "chevron-circle-down"} className="icon-arrow" />
              </span>
            </div>}>
          {
            isSavingPoltronas &&
            <Spinner config={customSpinConfig}>
              <span>This content will be show when isLoaded === true</span>
            </Spinner>
          }
          {
            !isSavingPoltronas &&
            < BusSelect
              isVolta={isVolta}
              horario={horario}
              seats={poltronas}
              onClickSeat={onClickSeat}
            />
          }
        </Panel >
      );

      return null;
    });

    return collapsibles;
  }


  // <div className="icon-loading">
  //   <Loading />
  // </div>

  render() {
    const { horarios, active } = this.props;

    if ((!horarios) || (horarios.length === 0)) {
      return null;
    }

    return (
      <Accordion activeKey={active}>
        {this.buildCollapsibles()}
      </Accordion>
    );
  }
}

export default HorariosAccordion;

