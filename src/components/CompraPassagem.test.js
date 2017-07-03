import React from 'react';
import store from '../store';
import CompraPassagem, { FormComprar } from './CompraPassagem';
import { shallow } from 'enzyme';
import { ValidationStatus, DateNowBr } from '../shared/Utils';
import { initialState } from '../reducers/compraPassagem.reducer';

const mockProps = {
  fields: { ...initialState },
  handlers: {
    handleChangeNome: jest.fn(),
    handleChangeCpf: jest.fn(),
    handleChangeOrigem: jest.fn(),
    handleChangeDestino: jest.fn(),
    handleChangeData: jest.fn(),
    handleChangeHorario: jest.fn(),
    handleChangePoltrona: jest.fn(),
    handleSubmit: jest.fn()
  }
}

describe('CompraPassagem VIEW', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <CompraPassagem store={store} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe('FormComprar', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <FormComprar props={mockProps} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('muda os valores do form', () => {
    const wrapper = shallow(
      <FormComprar props={mockProps} />
    );

    const event = {
      target: {
        value: 'teste'
      }
    };

    it('muda o nome', () => {
      const input = wrapper.find('#nome');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeNome).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeNome).toHaveBeenCalledWith(event);
    });

    it('muda o cpf', () => {
      const input = wrapper.find('#cpf');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeCpf).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeCpf).toHaveBeenCalledWith(event);
    });

    it('muda a origem', () => {
      const input = wrapper.find('#origem');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeOrigem).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeOrigem).toHaveBeenCalledWith(event);
    });

    it('muda a destino', () => {
      const input = wrapper.find('#destino');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeDestino).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeDestino).toHaveBeenCalledWith(event);
    });

    it('muda a data', () => {
      const input = wrapper.find('#data');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeData).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeData).toHaveBeenCalledWith(event);
    });

    it('muda o horario', () => {
      const input = wrapper.find('#horario');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangeHorario).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangeHorario).toHaveBeenCalledWith(event);
    });

    it('muda a poltrona', () => {
      const input = wrapper.find('#poltrona');
      input.simulate('change', event);
      expect(mockProps.handlers.handleChangePoltrona).toHaveBeenCalledTimes(1);
      expect(mockProps.handlers.handleChangePoltrona).toHaveBeenCalledWith(event);
    });
  });
});
