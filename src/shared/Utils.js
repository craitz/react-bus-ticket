export const SequenceArray = size => [...Array(size).keys()].map(i => ++i);
export const DateNowBr = new Date().toLocaleDateString('pt-BR');
export const DateBr = date => date.toLocaleDateString('pt-BR');