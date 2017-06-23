import { combineReducers } from 'redux';
import compraPassagemState from './compraPassagem.reducer';
import loginState from './login.reducer';

export default combineReducers({
  compraPassagemState,
  loginState
});