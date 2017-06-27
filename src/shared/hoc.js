import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { firebaseHelper } from './FirebaseHelper';
import { Glyphicon, Row } from 'react-bootstrap'

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
            <Glyphicon glyph="refresh" className="icon-loading" />
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

