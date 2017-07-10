import React from 'react';
import Datetime from 'react-datetime';

const InputDate = ({ value, placeholder, isValidDate, onChange }) =>
  <Datetime
    locale="pt-br"
    timeFormat={false}
    closeOnSelect={true}
    value={value}
    className="input-date"
    isValidDate={isValidDate}
    onChange={onChange}
    inputProps={{
      onKeyDown: e => e.preventDefault(),
      readOnly: true,
      placeholder
    }} />

export default InputDate;