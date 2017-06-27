import { combineReducers } from 'redux';
import compraPassagemState from './compraPassagem.reducer';
import pesquisaPassagensState from './pesquisaPassagens.reducer';
import loginState from './login.reducer';
import withLoadingState from './withLoading.reducer';

export default combineReducers({
  compraPassagemState,
  pesquisaPassagensState,
  loginState,
  withLoadingState
});