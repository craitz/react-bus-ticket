import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import ConfirmacaoPassagem from './components/ConfirmacaoPassagem';
import Layout from './components/Layout'
import App from './App';
import './App.css';

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <Layout>
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/passagem" component={ConfirmacaoPassagem} />
        </Switch>
      </Layout>
    </Provider>
  </Router>,
  document.getElementById('root')
);

registerServiceWorker();
