import React from 'react';
import ReactDOM from 'react-dom';
import CompraPassagem from './CompraPassagem';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CompraPassagem />, div);
});
