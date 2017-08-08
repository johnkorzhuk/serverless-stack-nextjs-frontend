// @flow
import { combineReducers } from 'redux';

import type { State, Action } from './types';

import auth from './auth/reducer';
import notes from './notes/reducer';

export const USER_LOGOUT = 'root/USER_LOGOUT';

const appReducer = combineReducers({ auth, notes });
const initialState = appReducer({}, {});
console.log(initialState);

export default (state?: State, action: Action) => {
  if (action.type === USER_LOGOUT) {
    // eslint-disable-next-line no-param-reassign
    state = initialState;
  }
  return appReducer(state, action);
};
