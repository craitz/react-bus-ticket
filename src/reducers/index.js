import { combineReducers } from 'redux';
import compraPassagemState from './compraPassagem.reducer';
import pesquisaPassagensState from './pesquisaPassagens.reducer';
import loginState from './login.reducer';
import perfilUsuarioState from './perfilUsuario.reducer';
import loadingDialogState from './loadingDialog.reducer';
import modalTrajetoState from './modalTrajeto.reducer';
import snackbarState from './snackbar.reducer';

export default combineReducers({
  compraPassagemState,
  pesquisaPassagensState,
  loginState,
  perfilUsuarioState,
  loadingDialogState,
  modalTrajetoState,
  snackbarState
});