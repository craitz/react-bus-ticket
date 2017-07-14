import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as utils from '../shared/Utils';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Accordion from 'react-responsive-accordion';
import BusSelect from './BusSelect';

class HorariosAccordion extends Component {
  constructor(props) {
    super(props);
    this.triggerClass = `btn-google-${this.props.color} btn-block collapse-trigger-button`;
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

  buildCollapsibles() {
    const { horarios, onClickSeat } = this.props;
    const collapsibles = [];

    for (let horario in horarios) {
      const poltronas = horarios[horario];
      const allSize = Object.keys(poltronas).length - 1;
      const ocupadasSize = [...Object.keys(poltronas)]
        .filter(item => poltronas[item] === utils.PoltronaStatus.RESERVED).length;
      const strLotacao = `${ocupadasSize.toString().padStart(2, '0')}/${allSize}`;
      const strHorario = utils.firebaseToTime(horario);
      collapsibles.push(
        <div
          key={horario}
          data-trigger={
            <Button type="button" className={this.triggerClass}>
              <span className="trigger-left pull-left">
                <FontAwesome name="clock-o" className="icon" />
                {(strHorario.length > 0) && <span className="text-after-icon">{strHorario}</span>}
              </span>
              <span className="pull-right">
                <FontAwesome name={this.getIconLotacao(ocupadasSize, allSize)} className="icon" />
                <span className="trigger-right text-after-icon">{strLotacao}</span>
              </span>
            </Button>}>
          <BusSelect seats={poltronas} onClickSeat={onClickSeat} onResetSeats={this.handleResetSeats} />
        </div>);
    }

    return collapsibles;
  }

  render() {
    const { horarios, className } = this.props;

    if ((!horarios) || (horarios.length === 0)) {
      return null;
    }

    return (
      <Accordion
        startPosition={-1}
        transitionTime={300}
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

