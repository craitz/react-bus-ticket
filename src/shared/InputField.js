import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

const InputField = ({ id, label, type, value, onChange }) =>
  <FormGroup controlId={id}>
    <ControlLabel>{label}</ControlLabel>
    <FormControl type={type} value={value} onChange={onChange} />
    <FormControl.Feedback />
  </FormGroup>

InputField.PropTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

InputField.defaultProps = {}

export default InputField;