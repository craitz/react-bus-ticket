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
        return 'done';
      }
      case utils.SnackbarTypes.ERROR: {
        return 'error';
      }
      case utils.SnackbarTypes.WARNING: {
        return 'warning';
      }
      default: {
        return '';
      }
    }
  }

  const getClass = (type) => {
    switch (type) {
      case utils.SnackbarTypes.SUCCESS: {
        return 'snack-content success';
      }
      case utils.SnackbarTypes.ERROR: {
        return 'snack-content error';
      }
      case utils.SnackbarTypes.WARNING: {
        return 'snack-content warning';
      }
      default: {
        return 'snack-content';
      }
    }
  }

  return (
    <span className={getClass(type)}>
      <i className="material-icons">{getIcon(type)}</i>
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

    const getType = () => {
      switch (type) {
        case utils.SnackbarTypes.SUCCESS: {
          return 'accept';
        }
        case utils.SnackbarTypes.ERROR: {
          return 'cancel';
        }
        case utils.SnackbarTypes.WARNING: {
          return 'warning';
        }
        default: {
          return '';
        }
      }
    }

    const getAction = () => {
      switch (type) {
        case utils.SnackbarTypes.SUCCESS: {
          return <FontAwesome name="check" />;
        }
        case utils.SnackbarTypes.ERROR: {
          return 'x';
        }
        case utils.SnackbarTypes.WARNING: {
          return 'exclamation-triangle';
        }
        default: {
          return '';
        }
      }
    }

    return (
      <SnackbarTB
        //className={type}
        active={visible}
        action="x"
        timeout={3500}
        label={<SnackContent type={type} message={message} />}
        type={getType()}
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