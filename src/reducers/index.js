import { combineReducers } from 'redux';
import compraPassagemState from './compraPassagem.reducer';
import formPassagemState from './formPassagem.reducer';

export default combineReducers({
  compraPassagemState,
  formPassagemState,
});