import React from 'react';
import ReactDOM from 'react-dom';
import CompraPassagem from './CompraPassagem';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store';
import { shallow, mount } from 'enzyme';


describe('CompraPassagem', () => {
  it('renders without crashing', () => {
    mount(
      <Router>
        <Provider store={store}>
          <CompraPassagem />
        </Provider>
      </Router>
    );
  });
});
