import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { firebaseHelper } from './FirebaseHelper';
import { Row } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';

export const withAuth = (WrappedComponent) => {
  return class PageWithAuth extends Component {
    render() {
      if (!firebaseHelper.isLoggedIn()) {
        return (
          <Redirect to='/login' />
        );
      } else {
        return (
          <WrappedComponent {...this.props}></WrappedComponent>
        );
      }
    }
  }
};

export const withLoading = (WrappedComponent) => {
  class ComponentWithLoading extends Component {
    render() {
      if (this.props.isLoading) {
        return (
          <Row className="text-center">
            <FontAwesome name="spinner" size="2x" className="icon-loading" spin></FontAwesome>
          </Row>
        );
      } else {
        return (
          <WrappedComponent {...this.props}></WrappedComponent>
        );
      }
    }
  }

  const mapStateToProps = (state) => {
    return {
      isLoading: state.withLoadingState.isLoading
    };
  };

  return connect(mapStateToProps)(ComponentWithLoading);
};

