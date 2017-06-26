import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux';
import { render } from 'enzyme';
import store from '../store';

describe('Login', () => {
  it('renders without crashing', () => {
    const container = render(
      <Router>
        <Provider store={store}>
          <Login />
        </Provider>
      </Router>
    );
  });
});

// describe('validateForm', () => {
//   it('must have no pristines', () => {
//     const container = shallow(
//       <Router>
//         <Provider store={store}>
//           <Login />
//         </Provider>
//       </Router>
//     );

//     container.instance().isLoginFormOK();

//     expect(container.text()).toEqual('');
//   });
// });
