import * as firebase from 'firebase';
import { SequenceArray } from '../shared/Utils.js';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBQq39NXj6qvnkEVmgEi3c4UZUAQ177dGs",
  authDomain: "busticket-be05f.firebaseapp.com",
  databaseURL: "https://busticket-be05f.firebaseio.com",
  projectId: "busticket-be05f",
  storageBucket: "busticket-be05f.appspot.com",
  messagingSenderId: "246935329575"
});

const rootRef = firebase.database().ref();

export const fetchCidades = () => {
  const cidadesRef = rootRef.child('cidades');
  return (dispatch) => {
    cidadesRef.on('value', snap => {
      dispatch({ type: 'FETCHING_CIDADES_FULFILLED', payload: snap.val() });
    });
  }
};

export const fetchHorarios = () => {
  const horariosRef = rootRef.child('horarios');
  return (dispatch) => {
    horariosRef.on('value', snap => {
      dispatch({ type: 'FETCHING_HORARIOS_FULFILLED', payload: snap.val() });
    });
  }
};

export const fetchPoltronas = () => {
  return {
    type: 'FETCH_POLTRONAS',
    payload: SequenceArray(42)
  }
};