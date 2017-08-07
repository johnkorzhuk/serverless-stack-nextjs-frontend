// @flow

import { GET_ALL_NOTES_SUCCESS, TOGGLE_LOADING, ADD_NEW_NOTE, UPDATE_NOTE, TOGGLE_UPLOADING } from './actions';
// eslint-disable-next-line no-use-before-define
import type { Action, Note } from '../types';

type State = {
  loading: boolean,
  uploading: boolean,
  all: Array<Note>
};

const INITIAL_STATE = {
  loading: false,
  uploading: false,
  all: []
};

export default (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case GET_ALL_NOTES_SUCCESS:
      return {
        ...state,
        all: [...state.all, ...action.payload]
      };

    case TOGGLE_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case ADD_NEW_NOTE:
      return {
        ...state,
        all: [...state.all, action.payload]
      };

    case UPDATE_NOTE:
      return {
        ...state,
        all: [...action.payload]
      };

    case TOGGLE_UPLOADING:
      return {
        ...state,
        uploading: action.payload
      };

    default:
      return state;
  }
};
