import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  ControlLabel,
  InputGroup,
  FormControl,
  HelpBlock,
  OverlayTrigger,
  Popover,
  Row,
  Label,
  Button,
  Jumbotron
} from 'react-bootstrap';
import Select from 'react-select';
import MaskedFormControl from 'react-bootstrap-maskedinput'
import FontAwesome from 'react-fontawesome';
// import DateTime from 'react-datetime';


// BASE FORM
export class BaseField extends Component {
  render() {
    const { id, label, validation, message, children } = this.props;

    return (
      <FormGroup controlId={id} validationState={validation}>
        <ControlLabel>{label}</ControlLabel>
        {children}
        {/*<FormControl.Feedback />*/}
        <HelpBlock>{message}</HelpBlock>
      </FormGroup>
    );
  }
}
BaseField.PropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validation: PropTypes.object,
  message: PropTypes.string
}

// INPUT FORM FIELD (HOC)
export const withInput = (WrappedComponent) => {
  return ({ id, label, type, value, onChange, validation, message, isDisabled }) => {
    const props = {
      id,
      label,
      validation,
      message
    };
    return (
      <WrappedComponent {...props}>
        <FormControl type={type} value={value} onChange={onChange} disabled={isDisabled} />
      </WrappedComponent>
    );
  }
}
withInput.PropTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool
}

withInput.defaultProps = {
  isDisabled: false,
  onChange: null
}

// INPUTMASK FORM FIELD (HOC)
export const withInputMask = (WrappedComponent) => {
  return ({ id, label, value, mask, onChange, validation, message }) => {
    const props = {
      id,
      label,
      validation,
      message
    };
    return (
      <WrappedComponent {...props}>
        <MaskedFormControl type='text' mask={mask} value={value} onChange={onChange} />
      </WrappedComponent>
    );
  }
}
withInput.PropTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool
}

withInput.defaultProps = {
  isDisabled: false,
  onChange: null
}

// SELECT FORM FIELD (HOC)
export const withSelect = (WrappedComponent) => {
  return ({ id, label, list, value, onChange, emptyMessage = '' }) => {
    const props = {
      id,
      label,
      list,
      value,
      onChange
    };
    return (
      <WrappedComponent {...props}>
        {list.length > 0 &&
          <FormControl value={value} componentClass="select" onChange={onChange}>
            {list.map((item, index) => <option value={index} key={index}>{item}</option>)}
          </FormControl>}
        {list.length === 0 &&
          <FormControl.Static className="error-empty">{emptyMessage}</FormControl.Static>}
      </WrappedComponent>
    );
  }
}
withSelect.PropTypes = {
  list: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string
}

const Seat = ({ children, className, onClickSeat, value }) => {
  return (
    <Label bsSize="xsmall" bsStyle="default" className={className} onClick={() => onClickSeat(value)}>{children}</Label>
  );
}

const BusRow = ({ rowClass, seats, onClickSeat, row }) => {
  const getValue = index => seats[index].value;
  const getLabel = index => seats[index].label;
  const getStatus = index => seats[index].status;

  return (
    <Row className={rowClass}>
      {row.map((seat, index) =>
        <Seat
          key={index}
          bsStyle="default"
          className={getStatus(seat)}
          onClickSeat={onClickSeat}
          value={getValue(seat)}>
          {getLabel(seat)}
        </Seat>)}
    </Row>

  );
}

const BusSeatsSelect = ({ seats, onClickSeat, onResetSeats }) => {
  return (
    <div className="bus-seat-select">
      <Row className="bus-row bus-row-legenda ">
        <Label bsSize="xsmall" className="free legenda">
          {/*<FontAwesome name="circle-o" />*/}
          <span>Livre</span>
        </Label>
        <Label bsSize="xsmall" className="selected legenda">
          {/*<FontAwesome name="check-circle-o" />*/}
          <span>Selecionada</span>
        </Label>
        <Label bsSize="xsmall" className="reserved legenda">
          {/*<FontAwesome name="ban" />*/}
          <span>Ocupada</span>
        </Label>
        <Button bsStyle="default" bsSize="xsmall" className="clean-bus pull-right" onClick={onResetSeats}>
          <FontAwesome name="times-circle" />
          <span className="text-after-icon">Limpar</span>
        </Button>
      </Row>
      <hr />
      <Jumbotron>
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42]}>
        </BusRow>
        <BusRow
          rowClass="bus-row corredor-acima"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43]}>
        </BusRow>
        <BusRow
          rowClass="bus-row corredor-abaixo"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41]}>
        </BusRow>
        <BusRow
          rowClass="bus-row"
          seats={seats}
          onClickSeat={onClickSeat}
          row={[0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40]}>
        </BusRow>
      </Jumbotron>
    </div >
  );
};

// MULTISELECT FORM FIELD (HOC)
export const withMultiSelect = (WrappedComponent) => {
  return ({ id, label, list, value, onChange, onClickSeat, onResetSeats,
    hint = 'Selecione...', validation, message, isDisabled = false, emptyMessage = '' }) => {

    const titleNode = (
      <div>
        <span>Escolha sua poltrona</span>
        {/*<FontAwesome id="sair" name="times" className="pull-right"></FontAwesome>*/}
      </div >
    );

    const busSeatsPopover = (
      <Popover id="bus-seats" title={titleNode}>
        <BusSeatsSelect seats={list} onClickSeat={onClickSeat} onResetSeats={onResetSeats} />
      </Popover>
    );

    const props = {
      id,
      label,
      validation,
      message
    };

    return (
      <WrappedComponent {...props}>
        {(list.length > 0) &&
          <InputGroup>
            <Select
              multi
              simpleValue
              searchable={false}
              clearValueText="Remover"
              clearAllText="Remover todas"
              disabled={isDisabled}
              placeholder={hint}
              value={value}
              options={list}
              onChange={onChange}
            />
            <OverlayTrigger trigger="click" rootClose placement="top" overlay={busSeatsPopover}>
              <InputGroup.Addon className="select-seat">
                <FontAwesome name="bus" />
              </InputGroup.Addon>
            </OverlayTrigger>
          </InputGroup>}
        {(list.length === 0) &&
          <FormControl.Static className="error-empty">{emptyMessage}</FormControl.Static>}
      </WrappedComponent>
    );
  }
}
withMultiSelect.PropTypes = {
  isDisabled: PropTypes.bool,
  hint: PropTypes.string,
  value: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  emptyMessage: PropTypes.string
}

// DATE FORM FIELD (HOC)
export const withDate = (WrappedComponent) => {
  return class DateField extends Component {

    render() {
      const { id, value, onChange } = this.props;
      // const yesterday = DateTime.moment().subtract(1, 'day');
      // const valid = (current) => current.isAfter(yesterday);
      const inputProps = { readOnly: true, id }

      return (
        <WrappedComponent {...this.props}>
          {/*<DateTime
            locale="pt-br"
            closeOnSelect={true}
            timeFormat={false}
            isValidDate={valid}
            inputProps={inputProps}
            value={value}
            onChange={onChange} />*/}
        </WrappedComponent>
      );
    }
  }
}

withDate.PropTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
