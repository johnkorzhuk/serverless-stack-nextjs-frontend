// @flow

import type { Action } from '../types';

import { SET_USER_TOKEN, TOGGLE_LOADING } from './actions';

type State = {
  userToken: ?string,
  loading: boolean
};

const INITIAL_STATE = {
  userToken: null,
  loading: false
};

export default (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_USER_TOKEN:
      return {
        ...state,
        userToken: action.payload
      };

    case TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
};
