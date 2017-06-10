import { combineReducers } from 'redux';
import passagem from './passagemReducer';
import listas from './listasReducer';

export default combineReducers({
  listas,
  passagem,
});