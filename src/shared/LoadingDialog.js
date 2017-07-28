import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SavingStatus } from './Utils';
import FontAwesome from 'react-fontawesome';
import { Modal } from 'react-bootstrap';

class LoadingDialog extends Component {
  render() {
    const { status, doneIcon, doneMessage, loadingIcon, loadingMessage } = this.props;

    return (
      <Modal show={status !== SavingStatus.DONE} className="loading-dialog-container">
        <Modal.Body>
          {(status === SavingStatus.SAVING) &&
            <div className="text-center">
              {/*<FontAwesome name="spinner" spin className="icon-saving"></FontAwesome>
                <span className="text-after-icon hidden-xs">Salvando alterações...</span>*/}
              <FontAwesome name={loadingIcon} spin className="icon-saving"></FontAwesome>
              <span className="loading-text-after-icon">{loadingMessage}</span>
            </div>}
          {(status === SavingStatus.FEEDBACK) &&
            <div className="text-center">
              {/*<FontAwesome name="check" className="icon-feedback"></FontAwesome>
                <span className="text-after-icon hidden-xs">Perfil salvo com sucesso!</span>*/}
              <FontAwesome name={doneIcon} className="icon-feedback"></FontAwesome>
              <span className="loading-text-after-icon">{doneMessage}</span>
            </div>}
        </Modal.Body>
      </Modal>
    );
    // }
  }
}

const mapStateToProps = (state) => {
  return {
    status: state.loadingDialogState.status,
    loadingMessage: state.loadingDialogState.loadingMessage,
    loadingIcon: state.loadingDialogState.loadingIcon,
    doneMessage: state.loadingDialogState.doneMessage,
    doneIcon: state.loadingDialogState.doneIcon
  }
}

export default connect(mapStateToProps)(LoadingDialog);