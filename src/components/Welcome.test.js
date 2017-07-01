import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store';
import renderer from 'react-test-renderer';
import Welcome from './Welcome';

describe('Welcome VIEW', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Router>
        <Provider store={store}>
          <Welcome />
        </Provider>
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});