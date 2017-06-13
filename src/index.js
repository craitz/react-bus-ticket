import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import ConfirmacaoPassagem from './components/ConfirmacaoPassagem';
import Layout from './components/Layout'
import CompraPassagem from './components/CompraPassagem';
import './App.css';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <Layout>
        <Switch>
          <Route exact path="/" component={CompraPassagem} />
          <Route path="/passagem" component={ConfirmacaoPassagem} />
          <Route exact path="/login" component={CompraPassagem} />
        </Switch>
      </Layout>
    </Provider>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
