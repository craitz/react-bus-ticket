import { firebaseHelper } from './FirebaseHelper';
import { SequenceArray, PoltronaStatus } from './Utils';
import * as utils from './Utils';
import moment from 'moment';

const fakeDataOptions = {
  days: 5,
  startHour: 8,
  endHour: 22,
  reservedPercentage: 0.2, // 20%
  email: 'guest@busticket.com'
}

const generateFakeData = (cidades, options) => {
  const cidadesOrigem = utils.deepCopy(cidades);
  const cidadesDestino = utils.deepCopy(cidades);
  const { days, startHour, endHour, reservedPercentage, email } = options;

  cidadesOrigem.forEach((origem, indexOrigem) => {
    cidadesDestino.forEach((destino, indexDestino) => {
      if (indexOrigem !== indexDestino) {

        for (let i = 1; i <= days; i++) {
          const dayAfter = moment().add(i, 'days').format('YYYY/MM/DD');
          const formattedDayAfter = utils.dateToFirebase(dayAfter);

          for (let j = startHour; j <= endHour; j++) {
            if (!!Math.floor(Math.random() * 2)) {
              const minuto = Math.floor((Math.random() * 59) + 1);
              const hora = j.toString().padStart(2, '0') + minuto.toString().padStart(2, '0');

              for (let k = 1; k <= 44; k++) {
                if (Math.random() < reservedPercentage) {
                  const poltrona = k.toString().padStart(2, '0');
                  const ref = `saidas/${origem}/${destino}/${formattedDayAfter}/${hora}/${poltrona}`;

                  firebaseHelper.set({
                    user: email
                  }, ref)
                    .then(() => {
                      console.log(ref);
                    });
                }
              }
            }
          }
        }
      }
      return destino;
    });
    return origem;
  });
};

class Globals {
  constructor() {
    this.cidades = null;
    this.horarios = null;
    this.poltronas = null;

    this.getCidades().then((cidades) => {

      // generate fake data
      // generateFakeData(cidades, fakeDataOptions);

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
