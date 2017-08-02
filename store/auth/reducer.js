// @flow

import { SET_USER_TOKEN } from './actions';

type State = {
  userToken: string | null
};

const INITIAL_STATE = {
  userToken: null
};

export default (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case SET_USER_TOKEN:
      return {
        ...state,
        userToken: action.payload
      };

    default:
      return state;
  }
};
