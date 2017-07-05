import * as firebase from 'firebase';
import { LoginFields } from './Utils';

class FirebaseHelper {
  constructor() {
    firebase.initializeApp({
      apiKey: "AIzaSyBQq39NXj6qvnkEVmgEi3c4UZUAQ177dGs",
      authDomain: "busticket-be05f.firebaseapp.com",
      databaseURL: "https://busticket-be05f.firebaseio.com",
      projectId: "busticket-be05f",
      storageBucket: "busticket-be05f.appspot.com",
      messagingSenderId: "246935329575"
    });
  }

  isLoggedIn() {
    return this.getUser();
  }

  getUser() {
    return firebase.auth().currentUser;
  }

  signIn(user, password) {
    let errorMessage = {
      text: '',
      field: ''
    };

    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user, password)
        .then((user) => {
          // this.setUser(user);
          resolve();
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            errorMessage = {
              text: 'E-mail inválido',
              field: LoginFields.EMAIL
            };
          } else if (error.code === 'auth/user-not-found') {
            errorMessage = {
              text: 'E-mail não cadastrado',
              field: LoginFields.EMAIL
            };
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = {
              text: 'Senha inválida',
              field: LoginFields.SENHA
            };
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = {
              text: 'Usuário desabilitado. Por favor, procure o administrador do sistema',
              field: LoginFields.EMAIL
            };
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = {
              text: 'Usuário bloqueado temporariamente. Tente novamente mais tarde',
              field: LoginFields.EMAIL
            };
          }

          reject(errorMessage);
        });
    });
  }

  signOut() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => {
          // this.setUser(null);
          resolve();
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  fetch(refPath) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).on('value', (snap) => {
        resolve(snap.val() || []);
      });
    });
  };

  fetchKeys(refPath) {
    const keys = [];
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).on('value', (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((snap) => {
            keys.push(Number(snap.key));
            if (keys.length === snapshot.numChildren()) {
              resolve(keys);
            }
          });
        } else {
          reject('Dados não encontrados!');
        }
      });
    });
  };

  save(data, refPath) {
    const db = firebase.database();
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

  set(data, refPath) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).set(data)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export const firebaseHelper = new FirebaseHelper();