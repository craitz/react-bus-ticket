import React, { Component } from 'react';
import * as utils from '../shared/Utils';
import { Panel, Accordion, ProgressBar } from 'react-bootstrap';
import BusSelect from './BusSelect';
import store from '../store';
import * as compraPassagemActions from '../actions/compraPassagem.actions';
import passengerRedLogo from '../styles/images/passenger-red.svg';
import checkLogo from '../styles/images/check3.svg';
import removeLogo from '../styles/images/remove.svg';
import clockLogo from '../styles/images/clock2.svg';
import TooltipOverlay from '../shared/TooltipOverlay';


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

  onClickPanel(selected) {
    const { isVolta } = this.props;
    !isVolta && store.dispatch(compraPassagemActions.setActiveAccordion(selected));
    isVolta && store.dispatch(compraPassagemActions.setActiveAccordionVolta(selected));
  }

  buildCollapsibles() {
    const { horarios, onClickSeat, isVolta } = this.props;
    const collapsibles = [];
    let count = 1;
    for (let horario in horarios) {
      const poltronas = horarios[horario];
      const allSize = Object.keys(poltronas).length - 1;
      const ocupadasSize = [...Object.keys(poltronas)]
        .filter(item => poltronas[item] === utils.PoltronaStatus.RESERVED).length;
      const percentLotacao = parseInt((ocupadasSize / allSize) * 100, 10);
      const strLotacao = `${ocupadasSize.toString().padStart(2, '0')}/${allSize}`;
      const strHorario = utils.firebaseToTime(horario);
      const position = count;

      collapsibles.push(
        <Panel
          key={horario}
          eventKey={position}
          onSelect={(selected) => this.onClickPanel(selected)}
          bsStyle="info"
          header={
            <div>
              <span className="trigger-left">
                <img src={clockLogo} height="30" alt="" className="horario-icon" />
                {(strHorario.length > 0) && <span className="text-after-icon text-horario">{strHorario}</span>}
              </span>
              <span className="trigger-right">
                {/*<img src={saveAllLogo} height="18" alt="" className="icon-saveall" />
                <img src={removeAllLogo} height="18" alt="" className="icon-saveall" />*/}
                <TooltipOverlay text="Desmarcar todas" position="top">
                  <img src={removeLogo} height="15" alt="" className="icon-remove" />
                </TooltipOverlay>
                <TooltipOverlay text="Salvar seleção" position="top">
                  <img src={checkLogo} height="15" alt="" className="icon-save icon-after-text" />
                </TooltipOverlay>
                {/*<ButtonIcon
                  type="button"
                  className="btn-google-red btn-salvar-poltronas"
                  label="Marcar poltronas"
                  icon="check" />*/}
                <img src={passengerRedLogo} height="16" alt="" className="icon-passenger" />
                {/*<FontAwesome name="ticket" className="poltronas-icon" />*/}
                <span className="text-after-icon poltronas-text">{strLotacao}</span>
                <ProgressBar
                  className={percentLotacao ? "full" : "empty"}
                  bsStyle="success"
                  now={percentLotacao} />
              </span>
            </div>}>
          < BusSelect isVolta={isVolta} horario={horario} seats={poltronas} onClickSeat={onClickSeat} onResetSeats={this.handleResetSeats} />
        </Panel >
      );
      count++;
    }

    return collapsibles;
  }

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

