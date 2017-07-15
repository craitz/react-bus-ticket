import React, { Component } from 'react';
import * as utils from '../shared/Utils';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Accordion from 'react-responsive-accordion';
import BusSelect from './BusSelect';
import store from '../store';
import * as compraPassagemActions from '../actions/compraPassagem.actions';

class HorariosAccordion extends Component {
  constructor(props) {
    super(props);
    this.triggerClass = `btn-google-${this.props.color} btn-block collapse-trigger-button`;
    this.onClickTrigger = this.onClickTrigger.bind(this);
  }

  getIconLotacao(ocupadas, size) {
    const breakpoint = size / 3;
    if (ocupadas === 0) {
      return 'battery-0';
    } else if (ocupadas < breakpoint) {
      return 'battery-1';
    } else if (ocupadas < breakpoint * 2) {
      return 'battery-2';
    } else if (ocupadas < breakpoint * 3) {
      return 'battery-3';
    } else {
      return 'battery-4';
    }
  }

  onClickTrigger(position) {
    const { isVolta } = this.props;
    !isVolta && store.dispatch(compraPassagemActions.setActiveAccordion(position));
    isVolta && store.dispatch(compraPassagemActions.setActiveAccordionVolta(position));
  }

  buildCollapsibles() {
    const { horarios, onClickSeat, isVolta } = this.props;
    const collapsibles = [];
    let count = 0;
    for (let horario in horarios) {
      const poltronas = horarios[horario];
      const allSize = Object.keys(poltronas).length - 1;
      const ocupadasSize = [...Object.keys(poltronas)]
        .filter(item => poltronas[item] === utils.PoltronaStatus.RESERVED).length;
      const strLotacao = `${ocupadasSize.toString().padStart(2, '0')}/${allSize}`;
      const strHorario = utils.firebaseToTime(horario);
      const position = count;
      collapsibles.push(
        <div
          key={horario}
          data-trigger={
            <Button type="button" className={this.triggerClass} onClick={() => this.onClickTrigger(position)}>
              <span className="trigger-left pull-left">
                <FontAwesome name="clock-o" className="icon" />
                {(strHorario.length > 0) && <span className="text-after-icon">{strHorario}</span>}
              </span>
              <span className="pull-right">
                <FontAwesome name={this.getIconLotacao(ocupadasSize, allSize)} className="icon" />
                <span className="trigger-right text-after-icon">{strLotacao}</span>
              </span>
            </Button>}>
          <BusSelect isVolta={isVolta} horario={horario} seats={poltronas} onClickSeat={onClickSeat} onResetSeats={this.handleResetSeats} />
        </div>);
      count++;
    }

    return collapsibles;
  }

  render() {
    const { horarios, className, active } = this.props;

    if ((!horarios) || (horarios.length === 0)) {
      return null;
    }

    return (
      <Accordion
        transitionTime={2000}
        easing="liner"
        startPosition={active}
        classParentString={className}>
        {this.buildCollapsibles()}
      </Accordion>
    );
  }
}

export default HorariosAccordion;

// const mapStateToProps = (state) => {
//   const { horarios, horariosVolta } = state.compraPassagemState;

//   return {
//     horarios,
//     horariosVolta
//   }
// }

//   //   className="accordion-volta"
//   // color="red"
//   // icon="arrow-left"


// export default connect(mapStateToProps)(HorariosAccordion);

