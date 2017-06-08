import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const SelectField = ({ id, label, list, value, onChange }) =>
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl value={value} componentClass="select" onChange={onChange}>
      {list.map((item, index) =>
        <option value={index} key={index}>{item.toUpperCase()}</option>
      )}
    </FormControl>
    <FormControl.Feedback />
  </FormGroup>

SelectField.PropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

SelectField.defaultProps = {
  value: 0,
}

export default SelectField;