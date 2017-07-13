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

  return (
    <Accordion
      startPosition={-1}
      transitionTime={300}
      classParentString={className}>
      {arrHorarios.map((item, index) =>
        <div
          key={index}
          data-trigger={
            <Button type="button" className={setTriggerClass()}>
              <FontAwesome name={icon} className="pull-left icon" />
              {(item.length > 0) && <span className="text-after-icon pull-right">{item}</span>}
              <FontAwesome name="clock-o" className="pull-right icon" />
            </Button>
          }>
          <BusSelect seats={getPoltronas(array, utils.timeToFirebase(item))} onClickSeat={onClickSeat} onResetSeats={this.handleResetSeats} />
        </div>
      )}
    </Accordion>
  );
};

export default ConditionalAccordion;