import React, { Component } from 'react';
import * as utils from '../shared/Utils';
import { Panel, Accordion, ProgressBar } from 'react-bootstrap';
import BusSelect from './BusSelect';
import store from '../store';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import TooltipOverlay from '../shared/TooltipOverlay';
import Spinner from 'react-spinner-children';
import IconButton from 'react-toolbox/lib/button/IconButton';

class HorariosAccordion extends Component {
  constructor(props) {
    super(props);
    this.onClickPanel = this.onClickPanel.bind(this);
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
      const elemHorario = utils.firebaseToTimeElement(horario);
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
                <TooltipOverlay text="Horário" position="top">
                  <i className="material-icons horario-icon">alarm</i>
                </TooltipOverlay>
                {(strHorario.length > 0) && elemHorario}
              </span>
              <span className="trigger-right">
                <TooltipOverlay text="Ocupação" position="top">
                  <i className="material-icons icon-passenger hidden-xs">airline_seat_recline_extra</i>
                </TooltipOverlay>
                <TooltipOverlay text="Adicionar poltronas selecionadas" position="top">
                  <IconButton
                    className="icon-save"
                    icon="playlist_add"
                    primary
                    onClick={(event) => onSaveSeats(event, isVolta, horario)}
                  />
                </TooltipOverlay>
                <TooltipOverlay text="Limpar seleção" position="top">
                  <IconButton
                    className="icon-remove"
                    icon="clear_all"
                    primary
                    onClick={() => onResetSeats(isVolta, horario)}
                  />
                </TooltipOverlay>
                <span className="text poltronas-text hidden-xs">
                  {strLotacao}
                </span>
                <ProgressBar
                  className={percentLotacao ? "full hidden-xs" : "empty hidden-xs"}
                  bsStyle="warning"
                  now={percentLotacao}
                />
                <IconButton
                  className="icon-arrow"
                  icon={isActive ? "arrow_drop_up" : "arrow_drop_down"}
                  primary />
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

