import { combineReducers } from 'redux';
import compraPassagemState from './compraPassagem.reducer';
import formPassagemState from './formPassagem.reducer';
import loginState from './login.reducer';

export default combineReducers({
  compraPassagemState,
  formPassagemState,
  loginState
});