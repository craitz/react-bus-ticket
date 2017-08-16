import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import Layout from './components/Layout'
import Login from './components/Login';
import CompraPassagem from './components/CompraPassagem';
import ConfirmaPassagem from './components/ConfirmaPassagem';
import PesquisaPassagens from './components/PesquisaPassagens';
import Welcome from './components/Welcome';
import PerfilUsuario from './components/PerfilUsuario';
import LoadingDialog from './shared/LoadingDialog';
import ModalTrajeto from './components/ModalTrajeto';
import theme from './styles/react-toolbox/theme.js'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';
import 'moment/locale/pt-br';
import 'animate.css/animate.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/react-toolbox/theme.css';
import './styles/mui.css'
import 'react-datetime/css/react-datetime.css';
import 'react-select/dist/react-select.css';
import 'material-design-icons/iconfont/material-icons.css';
import './App.css';

const runApp = () => {
  ReactDOM.render(
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <Layout>
            <LoadingDialog />
            <ModalTrajeto />
            <Switch>
              <Route exact path="/comprar" component={CompraPassagem} />
              <Route exact path="/login" component={Login} />
              <Route path="/passagem/:id" component={ConfirmaPassagem} />
              <Route path="/passagens" component={PesquisaPassagens} />
              <Route path="/perfil" component={PerfilUsuario} />
              <Route path="/" component={Welcome} />
            </Switch>
          </Layout>
        </ThemeProvider>
      </Provider>
    </Router>,
    document.getElementById('root')
  );

  registerServiceWorker();
};

runApp();
