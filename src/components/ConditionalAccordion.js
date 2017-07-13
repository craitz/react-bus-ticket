import React from 'react';
import * as utils from '../shared/Utils';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import Accordion from 'react-responsive-accordion';
import BusSelect from './BusSelect';

const ConditionalAccordion = ({ className, array, color, icon, onClickSeat }) => {
  // retorna todos os horarios de determnada data
  const getHorarios = () => {
    if (!array) { return null }
    const newArray = Object.keys(array);
    return newArray.sort().map(item => utils.firebaseToTime(item));
  }

  // retorna as poltronas reservadas de determinado horário
  const getPoltronas = (array, hora) => {
    const ocupadasArray = Object.keys(array[hora]);
    return [...Array(44).keys()].map(item => {
      const strValue = (++item).toString().padStart(2, '0');
      return {
        value: strValue,
        status: ocupadasArray.includes(strValue)
          ? utils.PoltronaStatus.RESERVED
          : utils.PoltronaStatus.FREE
      }
    });
  }

  // monta o class
  const setTriggerClass = () => `btn-google-${color} btn-block collapse-trigger-button`;

  // pega os horarios do dia
  const arrHorarios = getHorarios();

  // se não houver horários, não renderiza nada
  if (!arrHorarios) {
    return null;
  }

  const buildCollapsibles = () => {
    return arrHorarios.map((item, index) => {
      const hora = utils.timeToFirebase(item);
      const poltronas = getPoltronas(array, hora);
      const allSize = poltronas.length;

      // diminui 1 para desconsiderar o objeto 'status'
      const ocupadasSize = Object.keys(array[hora]).length - 1;

      const strLotacao = `${ocupadasSize.toString().padStart(2, '0')}/${allSize}`

      const getIconLotacao = () => {
        const breakpoint = allSize / 3;
        if (ocupadasSize === 0) {
          return 'battery-0';
        } else if (ocupadasSize < breakpoint) {
          return 'battery-1';
        } else if (ocupadasSize < breakpoint * 2) {
          return 'battery-2';
        } else if (ocupadasSize < breakpoint * 3) {
          return 'battery-3';
        } else {
          return 'battery-4';
        }
      }

      return (
        <div
          key={index}
          data-trigger={
            <Button type="button" className={setTriggerClass()}>
              <span className="trigger-left pull-left">
                <FontAwesome name="clock-o" className="icon" />
                {(item.length > 0) && <span className="text-after-icon">{item}</span>}
              </span>
              <span className="pull-right">
                <FontAwesome name={getIconLotacao()} className="icon" />
                <span className="trigger-right text-after-icon">{strLotacao}</span>
              </span>
            </Button>
          }>
          <BusSelect seats={poltronas} onClickSeat={onClickSeat} onResetSeats={this.handleResetSeats} />
        </div>
      );
    });
  }

  return (
    <Accordion
      startPosition={-1}
      transitionTime={300}
      classParentString={className}>
      {buildCollapsibles()}
    </Accordion>
  );
};

export default ConditionalAccordion;