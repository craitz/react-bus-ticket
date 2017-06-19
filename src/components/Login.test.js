import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store';
import { shallow, mount } from 'enzyme';

it('renders without crashing', () => {
  mount(
    <Router>
      <Provider store={store}>
        <Login />
      </Provider>
    </Router>
  );
});