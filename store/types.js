// @flow

export type Note = {
  userId: string,
  noteId: string,
  content: string,
  attachment?: string,
  createdAt: number
};

declare type ActionType =
  | 'root/USER_LOGOUT'
  | 'auth/SET_USER_TOKEN'
  | 'auth/SET_LOGGED_IN_EMAIL'
  | 'auth/TOGGLE_LOADING'
  | 'notes/TOGGLE_LOADING'
  | 'notes/GET_ALL_NOTES_SUCCESS'
  | 'notes/ADD_NEW_NOTE'
  | 'notes/UPDATE_NOTE'
  | 'notes/TOGGLE_UPLOADING';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload?: P
|};

export type Action =
  | ActionT<'root/USER_LOGOUT', null>
  | ActionT<'auth/SET_USER_TOKEN', ?string>
  | ActionT<'auth/SET_LOGGED_IN_EMAIL', string>
  | ActionT<'auth/TOGGLE_LOADING', boolean>
  | ActionT<'notes/TOGGLE_LOADING', boolean>
  | ActionT<'notes/GET_ALL_NOTES_SUCCESS', Array<Note>>
  | ActionT<'notes/ADD_NEW_NOTE', Note>
  | ActionT<'notes/UPDATE_NOTE', Array<Note>>
  | ActionT<'notes/TOGGLE_UPLOADING', boolean>;

export type State = {
  auth: {
    userToken: ?string,
    loading: false
  },
  notes: {
    loading: boolean,
    uploading: boolean,
    all: Array<Note>
  }
};

// eslint-disable-next-line no-use-before-define
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
// eslint-disable-next-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type GetState = () => State;
export type PromiseAction = Promise<Action>;
