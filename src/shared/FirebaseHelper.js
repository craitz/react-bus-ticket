import * as firebase from 'firebase';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBQq39NXj6qvnkEVmgEi3c4UZUAQ177dGs",
  authDomain: "busticket-be05f.firebaseapp.com",
  databaseURL: "https://busticket-be05f.firebaseio.com",
  projectId: "busticket-be05f",
  storageBucket: "busticket-be05f.appspot.com",
  messagingSenderId: "246935329575"
});

const db = firebase.database();

export const fetch = (refPath) => {
  return new Promise((resolve, reject) => {
    db.ref(refPath).on('value', (snap) => {
      resolve(snap.val());
    });
  });
};

export const save = (data, refPath) => {
  return new Promise((resolve, reject) => {
    const saved = db.ref(refPath).push(data)
    saved
      .then(() => {
        resolve(saved.key);
      })
      .catch((error) => {
        reject(error);
      });
  });
};