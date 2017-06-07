import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import PropTypes from 'prop-types';
import datepicker from 'js-datepicker';
import '../node_modules/js-datepicker/datepicker.css';
import './App.css';

class DatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: '',
    };
  }
  render() {
    const { idc } = this.props;
    const { data } = this.state;

    return (
      <FormControl type="text" defaultValue={data} id={idc} readOnly />
    );
  }

  componentDidMount() {
    const { idc } = this.props;
    datepicker(`#${idc}`, {
      position: 'tr', // Top right. 
      startDate: new Date(), // Today. 
      dateSelected: new Date(), // Today is selected. 
      minDate: new Date(), // Today is the min date. 
      maxDate: new Date(2099, 0, 1), // Jan 1st, 2099. 
      formatter: function (el, date) {
        el.value = date.toLocaleDateString('pt-BR');
      },
    });
  }

}

DatePicker.PropTypes = {
  idc: PropTypes.number.isRequired
}
DatePicker.defaultProps = {}

export default DatePicker;