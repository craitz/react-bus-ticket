import React from 'react';
import Datetime from 'react-datetime';

const InputDate = ({ placeholder, isValidDate }) =>
  <Datetime
    locale="pt-br"
    timeFormat={false}
    closeOnSelect={true}
    className="input-date"
    isValidDate={isValidDate}
    inputProps={{
      onKeyDown: e => e.preventDefault(),
      readOnly: true,
      placeholder
    }} />

export default InputDate;