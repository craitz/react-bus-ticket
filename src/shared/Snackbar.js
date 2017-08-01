import React, { Component } from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import SnackbarTB from 'react-toolbox/lib/snackbar/Snackbar';
import * as utils from './Utils';
import * as actions from '../actions/snackbar.actions';

// import PropTypes from 'prop-types';

const SnackContent = ({ type, message }) => {
  const getIcon = (type) => {
    switch (type) {
      case utils.SnackbarTypes.SUCCESS: {
        return 'check';
      }
      case utils.SnackbarTypes.ERROR: {
        return 'times';
      }
      case utils.SnackbarTypes.WARNING: {
        return 'exclamation';
      }
      default: {
        return '';
      }
    }
  }

  return (
    <span>
      <FontAwesome name={getIcon(type)} />
      <span className="text-after-icon">{message}</span>
    </span>
  );
};

class Snackbar extends Component {
  constructor(props) {
    super(props);
    this.handleSnackbarClick = this.handleSnackbarClick.bind(this);
    this.handleSnackbarTimeout = this.handleSnackbarTimeout.bind(this);
  }

  handleSnackbarClick = (event, instance) => {
    this.props.dispatch(actions.setVisible(false));
  };

  handleSnackbarTimeout = (event, instance) => {
    this.props.dispatch(actions.setVisible(false));
  };

  render() {
    const { visible, message, type } = this.props;

    return (
      <SnackbarTB
        className={type}
        active={visible}
        action={<FontAwesome name="times-circle" />}
        timeout={2500}
        label={<SnackContent type={type} message={message} />}
        type='cancel'
        onClick={this.handleSnackbarClick}
        onTimeout={this.handleSnackbarTimeout}
      />
    );
  }
}

// Snackbar.PropTypes = {}
// Snackbar.defaultProps = {}

const mapStateToProps = (state) => {
  return {
    visible: state.snackbarState.visible,
    message: state.snackbarState.message,
    type: state.snackbarState.type
  }
}

export default connect(mapStateToProps)(Snackbar);