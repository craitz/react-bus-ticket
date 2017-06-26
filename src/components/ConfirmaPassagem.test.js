import React from 'react';
import ReactDOM from 'react-dom';
import ConfirmaPassagem from './ConfirmaPassagem';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store';
import { shallow, mount } from 'enzyme';

describe('ConfirmaPassagem', () => {
  it('renders without crashing', () => {
    mount(
      <Router>
        <Provider store={store}>
          <ConfirmaPassagem />
        </Provider>
      </Router>
    );
  });
});
