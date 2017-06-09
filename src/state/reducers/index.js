import { combineReducers } from 'redux';
import {
  setNome,
  setEmail,
  setOrigem,
  setDestino,
  setPoltrona,
  setData,
  setHorario,
} from './FormPassagem.reducer.js';

export default combineReducers({
  setNome,
  setEmail,
  setOrigem,
  setDestino,
  setPoltrona,
  setData,
  setHorario,
});