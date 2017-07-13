import React from 'react';
import { Row, Jumbotron, Label } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import * as utils from '../shared/Utils';

const Seat = ({ className, onClickSeat, value, status }) => {
  return (
    <Label bsSize="xsmall" bsStyle="default" className={className} onClick={() => onClickSeat(value)}>
      {(status === utils.PoltronaStatus.RESERVED) && <FontAwesome name="ban" />}
      {(status !== utils.PoltronaStatus.RESERVED) && value}
    </Label>
  );
}

const BusRow = ({ rowClass, seats, onClickSeat, row }) => {
  const getValue = index => seats[index].value;
  const getStatus = index => seats[index].status;

  return (
    <Row className={rowClass}>
      {row.map((item, index) =>
        <Seat
          key={index}
          bsStyle="default"
          className={getStatus(item)}
          onClickSeat={onClickSeat}
          value={getValue(item)}
          status={getStatus(item)} />)}
    </Row>
  );
}

const BusSelect = ({ seats, onClickSeat, onResetSeats }) => {
  return (
    <div className="bus-seat-select">
      <Jumbotron>
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42]} />
        <BusRow
          rowClass="bus-row corredor-acima"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43]} />
        <BusRow
          rowClass="bus-row corredor-abaixo"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41]} />
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]} />
      </Jumbotron>
    </div >
  );
};

export default BusSelect;