import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { DateBr } from './Utils';
// import datepicker from 'js-datepicker';
import Select from 'react-select';
import MaskedFormControl from 'react-bootstrap-maskedinput'
import DatePicker from 'react-bootstrap-date-picker';
// import '../../node_modules/js-datepicker/datepicker.css';
import 'react-select/dist/react-select.css';

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

// MULTISELECT FORM FIELD (HOC)
export const withMultiSelect = (WrappedComponent) => {
  return ({ id, label, list, value, onChange, hint = 'Selecione...', validation, message, isDisabled = false, emptyMessage = '' }) => {
    const props = {
      id,
      label,
      validation,
      message
    };
    return (
      <WrappedComponent {...props}>
        {(list.length > 0) &&
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
            onChange={onChange} />}
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
    componentDidMount() {
      const { id, onChange } = this.props;

      // datepicker(`#${id}`, {
      //   position: 'tr', // Top right.
      //   startDate: new Date(), // Today.
      //   dateSelected: new Date(), // Today is selected.
      //   minDate: new Date(), // Today is the min date.
      //   maxDate: new Date(2099, 0, 1), // Jan 1st, 2099.
      //   formatter: (el, date) => el.value = DateBr(date),
      //   onSelect: (instance) => onChange(DateBr(instance.dateSelected))
      // });
    }

    render() {
      const { value } = this.props;
      return (
        <WrappedComponent {...this.props}>
          <DatePicker value={value} showClearButton={false} onkeydown="return false" />
          {/*<FormControl type="text" value={value} readOnly />*/}
        </WrappedComponent>
      );
    }
  }
}

withDate.PropTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
