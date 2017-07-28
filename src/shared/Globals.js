import { firebaseHelper } from './FirebaseHelper';

class Globals {
  constructor() {
    this.cidades = null;
    this.cidadesRaw = null;
    this.getCidades().then((cidades) => {
      this.cidadesRaw = cidades;
      this.cidades = cidades.map((item, index) => {
        return {
          label: item,
          value: index.toString(),
          disabled: false
        }
      });
    });
  }

  getCidadesRaw() {
    return this.cidadesRaw;
  }

  getCidades() {
    return new Promise((resolve, reject) => {
      if (this.cidades) {
        resolve([].concat(this.cidades))
      } else {
        firebaseHelper.fetch('cidades/')
          .then((cidades) => {
            cidades.sort();
            this.cidades = cidades;
            resolve(cidades);
          });
      }
    });
  }
};

export const globals = new Globals();
