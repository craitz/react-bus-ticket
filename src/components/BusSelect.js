import React from 'react';
import { Row, Jumbotron, Label } from 'react-bootstrap';

const Seat = ({ className, onClickSeat, isVolta, horario, value, status }) => {
  return (
    <Label
      bsSize="xsmall"
      bsStyle="default"
      className={className}
      onClick={() => onClickSeat(isVolta, horario, value, status)}>
      {value}
    </Label>
  );
}

const BusRow = ({ rowClass, isVolta, horario, seats, onClickSeat, row }) => {
  return (
    <Row className={rowClass}>
      {row.map((item, index) =>
        <Seat
          key={index}
          bsStyle="default"
          className={seats[item]}
          onClickSeat={onClickSeat}
          isVolta={isVolta}
          horario={horario}
          value={item}
          status={seats[item]} />)}
    </Row>
  );
}

const BusSelect = ({ horario, isVolta, seats, onClickSeat, onResetSeats }) => {
  return (
    <div className="bus-seat-select">
      <Jumbotron>
        <BusRow
          rowClass="bus-row"
          isVolta={isVolta}
          horario={horario}
          seats={seats}
          onClickSeat={onClickSeat}
          row={['03', '07', '11', '15', '19', '23', '27', '31', '35', '39', '43']} />
        <BusRow
          rowClass="bus-row corredor-acima"
          isVolta={isVolta}
          horario={horario}
          seats={seats}
          onClickSeat={onClickSeat}
          row={['04', '08', '12', '16', '20', '24', '28', '32', '36', '40', '44']} />
        <BusRow
          rowClass="bus-row corredor-abaixo"
          isVolta={isVolta}
          horario={horario}
          seats={seats}
          onClickSeat={onClickSeat}
          row={['02', '06', '10', '14', '18', '22', '26', '30', '34', '38', '42']} />
        <BusRow
          rowClass="bus-row"
          isVolta={isVolta}
          horario={horario}
          seats={seats}
          onClickSeat={onClickSeat}
          row={['01', '05', '09', '13', '17', '21', '25', '29', '33', '37', '41']} />
      </Jumbotron>
    </div >
  );
};

export default BusSelect;