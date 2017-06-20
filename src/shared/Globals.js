import { firebaseHelper } from './FirebaseHelper';
import { SequenceArray } from './Utils';

class Globals {
  constructor() {
    this.cidades = null;
    this.horarios = null;
    this.poltronas = null;

    this.getCidades().then((cidades) => {
      this.cidades = cidades;
    });

    this.getHorarios().then((horarios) => {
      this.horarios = horarios;
    });

    this.poltronas = SequenceArray(42);
  }

  getCidades() {
    return new Promise((resolve, reject) => {
      if (this.cidades) {
        resolve(this.cidades)
      } else {
        firebaseHelper.fetch('cidades/')
          .then((cidades) => {
            cidades.sort();
            resolve(cidades);
          });
      }
    });
  }

  getHorarios() {
    return new Promise((resolve, reject) => {
      if (this.horarios) {
        resolve(this.horarios)
      } else {
        firebaseHelper.fetch('horarios/')
          .then((horarios) => {
            horarios.sort();
            resolve(horarios);
          });
      }
    });
  }
};

export const globals = new Globals();
