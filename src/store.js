import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import reducer from './reducers';

const configureStore = () => {
  const logger = createLogger({
    collapsed: true,
    duration: true,
    diff: true,
    level: ''
  });

  const middleware = applyMiddleware(promise(), thunk, logger);

  return createStore(reducer, middleware);
}

export default configureStore();
