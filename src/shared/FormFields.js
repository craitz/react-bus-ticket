import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { DateBr } from './Utils.js';
import datepicker from 'js-datepicker';
import '../../node_modules/js-datepicker/datepicker.css';

// BASE FORM
export class BaseField extends Component {
  render() {
    const { id, label, validation, validationText, children } = this.props;

    return (
      <FormGroup controlId={id} validationState={validation}>
        <ControlLabel>{label}</ControlLabel>
        {children}
        {validation && <FormControl.Feedback />}
        {validation && <HelpBlock>{validationText}</HelpBlock>}
      </FormGroup>
    );
  }
}
BaseField.PropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  validation: PropTypes.string,
  validationText: PropTypes.string
}

// INPUT FORM FIELD (HOC)
export const withInput = (WrappedComponent) => {
  return ({ id, label, type, value, onChange, validation, validationText }) => {
    const props = {
      id,
      label,
      validation,
      validationText
    };
    return (
      <WrappedComponent {...props}>
        <FormControl type={type} value={value} onChange={onChange} />
      </WrappedComponent>
    );
  }
}
withInput.PropTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

// SELECT FORM FIELD (HOC)
export const withSelect = (WrappedComponent) => {
  return ({ id, label, list, value, onChange }) => {
    const props = {
      id,
      label,
      list,
      value,
      onChange
    };
    return (
      <WrappedComponent {...props}>
        <FormControl value={value} componentClass="select" onChange={onChange}>
          {list.map((item, index) => <option value={index} key={index}>{item}</option>)}
        </FormControl>
      </WrappedComponent>
    );
  }
}
withSelect.PropTypes = {
  list: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

// DATE FORM FIELD (HOC)
export const withDate = (WrappedComponent) => {
  return class DateField extends Component {
    componentDidMount() {
      const { id, onChange } = this.props;

      datepicker(`#${id}`, {
        position: 'tr', // Top right.
        startDate: new Date(), // Today.
        dateSelected: new Date(), // Today is selected.
        minDate: new Date(), // Today is the min date.
        maxDate: new Date(2099, 0, 1), // Jan 1st, 2099.
        formatter: (el, date) => el.value = DateBr(date),
        onSelect: (instance) => onChange(DateBr(instance.dateSelected))
      });
    }

    render() {
      const { value } = this.props;
      return (
        <WrappedComponent {...this.props}>
          <FormControl type="text" value={value} readOnly />
        </WrappedComponent>
      );
    }
  }
}
withDate.PropTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
