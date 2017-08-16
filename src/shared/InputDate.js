import React, { Component } from 'react';
import Datetime from 'react-datetime';

class InputDate extends Component {
  render() {
    const { value, isValidDate, onChange, placeholder } = this.props;
    return (
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
    );
  }
}

export default InputDate;