// @flow

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
// eslint-disable-next-line import/no-extraneous-dependencies
import logger from 'redux-logger';

import rootReducer from './reducers';

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

const store = createStore(rootReducer, undefined, composeWithDevTools(applyMiddleware(...middleware)));

export default (initialState: State = store.getState()) =>
  createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
