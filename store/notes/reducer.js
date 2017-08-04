// @flow

import { GET_ALL_NOTES_SUCCESS, GET_ALL_NOTES_LOADING, ADD_NEW_NOTE } from './actions';

type State = {
  loading: boolean,
  all: Array<Note>
};

const INITIAL_STATE = {
  loading: false,
  all: []
};

export default (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case GET_ALL_NOTES_SUCCESS:
      return {
        ...state,
        all: [...state.all, ...action.payload]
      };

    case GET_ALL_NOTES_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ADD_NEW_NOTE:
      return {
        ...state,
        all: [...state.all, action.payload]
      };

    default:
      return state;
  }
};
