import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { DateBr } from './Utils.js';
import datepicker from 'js-datepicker';
import '../../node_modules/js-datepicker/datepicker.css';

class DateField extends Component {

  componentDidMount() {
    const { id, onChange } = this.props;

    datepicker(`#${id}`, {
      position: 'tr', // Top right. 
      startDate: new Date(), // Today. 
      dateSelected: new Date(), // Today is selected. 
      minDate: new Date(), // Today is the min date. 
      maxDate: new Date(2099, 0, 1), // Jan 1st, 2099. 
      formatter: (el, date) =>
        el.value = DateBr(date),
      onSelect: (instance) =>
        onChange(DateBr(instance.dateSelected)),
    });
  }

  render() {
    const { id, label, value } = this.props;

    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl type="text" value={value} readOnly />
        <FormControl.Feedback />
      </FormGroup>);
  }
}

DateField.PropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

DateField.defaultProps = {}

export default DateField;