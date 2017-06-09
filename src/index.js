import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './state/store/configureStore';
import * as firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';
import App from './App';
import './index.css';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBQq39NXj6qvnkEVmgEi3c4UZUAQ177dGs",
  authDomain: "busticket-be05f.firebaseapp.com",
  databaseURL: "https://busticket-be05f.firebaseio.com",
  projectId: "busticket-be05f",
  storageBucket: "busticket-be05f.appspot.com",
  messagingSenderId: "246935329575"
};
firebase.initializeApp(config);

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
