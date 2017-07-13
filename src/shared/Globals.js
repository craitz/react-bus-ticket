import { firebaseHelper } from './FirebaseHelper';
import * as utils from './Utils';
import moment from 'moment';

const fakeDataOptions = {
  days: 30,
  startHour: 8,
  endHour: 22,
  reservedPercentage: 0.2, // 20%
  horariosPercentage: 0.3, // 20%
  email: 'guest@busticket.com',
  doGenerate: false
}

const fakeGenerator = (() => {
  const getFutureDay = daysAhead => moment().add(daysAhead, 'days').format('DD/MM/YYYY');
  const randomMinute = () => Math.floor((Math.random() * 59));
  const randomBoolean = () => !!Math.floor(Math.random() * 2);
  const randomPercent = percent => (Math.random() < percent);
  const randomPoltronas = () => {
    const master = Math.random();

    if (master < 0.1) {
      return (Math.random() < 0.9);
    }

    if (master < 0.3) {
      return (Math.random() < 0.6);
    }

    if (master < 0.5) {
      return (Math.random() < 0.3);
    }

    return (Math.random() < 0.1);
  }

  const generate = (cidades, options) => {
    const { days, startHour, endHour, horariosPercentage, email, doGenerate } = options;

    if (!doGenerate) {
      return;
    }

    for (let o = 0; o < cidades.length; o++) {
      for (let d = 0; d < cidades.length; d++) {
        const origem = cidades[o];
        const destino = cidades[d];

        if (o !== d) { // só entre cidades diferentes!

          for (let i = 0; i <= days; i++) { // número de dias a serem gerados
            const data = utils.dateToFirebase(getFutureDay(i));

            for (let j = startHour; j <= endHour; j++) { // período válido para o horário
              if (randomPercent(horariosPercentage)) {
                const horario = j.toString().padStart(2, '0') + randomMinute().toString().padStart(2, '0');

                if (randomBoolean()) {
                  const refHora = `saidas/${origem}/${destino}/${data}/${horario}/`;
                  firebaseHelper.set({ status: 'ocupado' }, refHora);
                  for (let k = 1; k <= 44; k++) { // poltronas
                    if (randomPoltronas()) {
                      const poltrona = k.toString().padStart(2, '0');
                      const ref = `saidas/${origem}/${destino}/${data}/${horario}/${poltrona}`;
                      firebaseHelper.set({ user: email }, ref).then(() => {
                        console.log(ref);
                      });
                    }
                  }
                } else {
                  const ref = `saidas/${origem}/${destino}/${data}/${horario}/`;
                  firebaseHelper.set({ status: 'vazio' }, ref).then(() => {
                    console.log(ref);
                  });
                }
              }
            }
          }
        }
      }
    }
  };

  return { generate };
})();

class Globals {
  constructor() {
    this.cidades = null;
    this.getCidades().then((cidades) => {
      fakeGenerator.generate(cidades, fakeDataOptions); // generate fake data

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
