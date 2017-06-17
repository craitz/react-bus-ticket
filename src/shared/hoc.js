import React, { Component } from 'react';
import { Redirect } from 'react-router';
import FirebaseHelper from './FirebaseHelper';

export const withAuth = (WrappedComponent) => {
  return class PageWithAuth extends Component {
    render() {

      console.log('renderizou com auth!');
      if (!FirebaseHelper.isLoggedIn()) {
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