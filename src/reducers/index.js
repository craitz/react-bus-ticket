import { combineReducers } from 'redux';
import appState from './app.reducer';
import formPassagemState from './formPassagem.reducer';

export default combineReducers({
  appState,
  formPassagemState,
});