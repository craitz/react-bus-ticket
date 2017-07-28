import * as firebase from 'firebase';
import { LoginFields, emailToFirebaseKey } from './Utils';

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

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  getUserEmail() {
    return this.user.email;
  }

  getFirebaseUserEmail() {
    return emailToFirebaseKey(this.user.email);
  }

  getUserName() {
    return this.user.nome;
  }

  getUserCpf() {
    return this.user.cpf;
  }

  signIn(user, password) {
    let errorMessage = {
      text: '',
      field: ''
    };

    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(user, password)
        .then((user) => {
          this.fetchUser(`users/${emailToFirebaseKey(user.email)}`)
            .then((fetchedUser) => {
              this.setUser({
                email: user.email,
                nome: fetchedUser.nome,
                cpf: fetchedUser.cpf
              });
              resolve();
            })
            .catch((error) => {
              console.log(error);
              this.setUser(null);
            });
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

  fetchSnapshot(refPath) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).on('value', (snap) => {
        resolve(snap || []);
      });
    });
  };

  fetchUser(refPath) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).on('value', (snap) => {
        resolve(snap.val() || null);
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

  delete(refPath) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(refPath).remove()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  setUserOnFirebase(user) {
    const db = firebase.database();
    return new Promise((resolve, reject) => {
      db.ref(`users/${this.getFirebaseUserEmail()}`).set(user)
        .then(() => {
          this.setUser({
            ...this.getUser(),
            nome: user.nome,
            cpf: user.cpf
          });
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export const firebaseHelper = new FirebaseHelper();