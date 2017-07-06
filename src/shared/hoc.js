import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { firebaseHelper } from './FirebaseHelper';

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

