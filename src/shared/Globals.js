import { firebaseHelper } from './FirebaseHelper';
import * as utils from './Utils';
import moment from 'moment';

const randomMinute = () => Math.floor((Math.random() * 59));
const randomBoolean = () => !!Math.floor(Math.random() * 2);
const randomPercent = percent => (Math.random() < percent);
const getFutureDay = daysAhead => moment().add(daysAhead, 'days').format('DD/MM/YYYY');
const fakeDataOptions = {
  days: 10,
  startHour: 8,
  endHour: 22,
  reservedPercentage: 0.2, // 20%
  horariosPercentage: 0.3, // 20%
  email: 'guest@busticket.com'
}

const generateFakeData = (cidades, options) => {
  const { days, startHour, endHour, reservedPercentage, horariosPercentage, email } = options;

  for (let o = 0; o < cidades.length; o++) {
    for (let d = 0; d < cidades.length; d++) {
      const origem = cidades[o];
      const destino = cidades[d];

      if (o !== d) { // só entre cidades diferentes!

        for (let i = 1; i <= days; i++) { // número de dias a serem gerados
          const data = utils.dateToFirebase(getFutureDay(i));

          for (let j = startHour; j <= endHour; j++) { // período válido para o horário
            if (randomPercent(horariosPercentage)) {
              const horario = j.toString().padStart(2, '0') + randomMinute().toString().padStart(2, '0');

              for (let k = 1; k <= 44; k++) { // poltronas
                if (randomPercent(reservedPercentage)) {
                  const poltrona = k.toString().padStart(2, '0');
                  const ref = `saidas/${origem}/${destino}/${data}/${horario}/${poltrona}`;
                  firebaseHelper.set({ user: email }, ref).then(() => {
                    console.log(ref);
                  });
                }
              }
            }
          }
        }
      }
    }
  }
};

class Globals {
  constructor() {
    this.cidades = null;

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
};

export const globals = new Globals();
