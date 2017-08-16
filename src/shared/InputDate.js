import React, { Component } from 'react';
import Datetime from 'react-datetime';

class InputDate extends Component {
  constructor(props) {
    super(props);
    this.onFocusEx = this.onFocusEx.bind(this);
    this.state = { isOpen: false };
  }

  onFocusEx(callback) {
    this.setState({ isOpen: true });
    callback();
  }

  render() {
    const { value, isValidDate, onChange, onFocus, placeholder } = this.props;
    return (
      <Datetime
        locale="pt-br"
        timeFormat={false}
        closeOnSelect={true}
        value={value}
        className="input-date"
        isValidDate={isValidDate}
        onChange={onChange}
        open={false}
        //        onFocus={() => this.onFocusEx(onFocus)}
        //      onBlur={this.setState({ isOpen: false })}
        inputProps={{
          onKeyDown: e => e.preventDefault(),
          readOnly: true,
          placeholder
        }} />
    );
  }
}

export default InputDate;