import * as firebase from 'firebase';

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

    this.db = firebase.database();
    this.user = null;
  }

  isLoggedIn() {
    return (this.user);
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  login(user, password) {
    let errorMessage = '';
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user, password)
        .then((user) => {
          this.setUser(user);
          resolve();
        })
        .catch((error) => {
          if (error.code === 'auth/invalid-email') {
            errorMessage = 'E-mail inválido!';
          } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'E-mail não cadastrado!';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Senha inválida!';
          } else if (error.code === 'auth/user-disabled') {
            errorMessage = 'Usuário desabilitado. Por favor, procure o administrador do sistema.';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Usuário bloqueado temporariamente. Tente novamente mais tarde.';
          }

          reject(errorMessage);
        });
    });
  }

  logout() {
    return new Promise((resolve, reject) => {
      firebase.auth().signOut()
        .then(() => {
          this.setUser(null);
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