import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from '../store';
import renderer from 'react-test-renderer';
// import Navigation from '../shared/Navigation';
import Layout from './Layout';

describe('Layout VIEW', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Router>
        <Provider store={store}>
          <Layout />
        </Provider>
      </Router>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});