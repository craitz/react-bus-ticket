export function setNome(state = '', action) {
  switch (action.type) {
    case 'SET_NOME':
      return action.nome;
    default:
      return state;
  }
}

export function setEmail(state = '', action) {
  switch (action.type) {
    case 'SET_EMAIL':
      return action.email;
    default:
      return state;
  }
}

export function setOrigem(state = {}, action) {
  switch (action.type) {
    case 'SET_ORIGEM':
      return action.origem;
    default:
      return state;
  }
}

export function setDestino(state = {}, action) {
  switch (action.type) {
    case 'SET_DESTINO':
      return action.destino;
    default:
      return state;
  }
}

export function setPoltrona(state = {}, action) {
  switch (action.type) {
    case 'SET_POLTRONA':
      return action.poltrona;
    default:
      return state;
  }
}

export function setData(state = {}, action) {
  switch (action.type) {
    case 'SET_DATA':
      return action.data;
    default:
      return state;
  }
}

export function setHorario(state = {}, action) {
  switch (action.type) {
    case 'SET_HORARIO':
      return action.horario;
    default:
      return state;
  }
}