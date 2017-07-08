import { firebaseHelper } from './FirebaseHelper';
import { SequenceArray, PoltronaStatus } from './Utils';

class Globals {
  constructor() {
    this.cidades = null;
    this.horarios = null;
    this.poltronas = null;

    this.getCidades().then((cidades) => {
      this.cidades = cidades.map((item, index) => {
        return {
          label: item,
          value: index.toString(),
          disabled: false
        }
      });
    });

    this.getHorarios().then((horarios) => {
      this.horarios = horarios;
    });

    this.poltronas = SequenceArray(44).map((poltrona, index) => {
      return {
        label: poltrona.toString().padStart(2, '0'),
        value: index.toString(),
        disabled: false,
        status: PoltronaStatus.FREE
      };
    });
  }

  getCidades() {
    return new Promise((resolve, reject) => {
      if (this.cidades) {
        resolve([].concat(this.cidades))
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
        resolve([].concat(this.horarios))
      } else {
        firebaseHelper.fetch('horarios/')
          .then((horarios) => {
            horarios.sort();
            resolve(horarios);
          });
      }
    });
  }

  getPoltronas() {
    return [].concat(this.poltronas);
  }
};

export const globals = new Globals();
