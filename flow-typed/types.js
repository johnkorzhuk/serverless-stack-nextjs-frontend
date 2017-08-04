// @flow

export type Note = {
  userId: string,
  noteId: string,
  content: string,
  attachment?: File,
  createdAt: number
};

declare type ActionType =
  | 'auth/SET_USER_TOKEN'
  | 'notes/GET_ALL_NOTES_LOADING'
  | 'notes/GET_ALL_NOTES_SUCCESS'
  | 'notes/ADD_NEW_NOTE';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload: P
|};

export type Action =
  | ActionT<'auth/SET_USER_TOKEN', string>
  | ActionT<'notes/GET_ALL_NOTES_LOADING', boolean>
  | ActionT<'notes/GET_ALL_NOTES_SUCCESS', Array<Note>>
  | ActionT<'notes/ADD_NEW_NOTE', Note>;

export type State = {
  auth: {
    userToken: string
  },
  notes: {
    loading: boolean,
    all: Array<Note>
  }
};

// eslint-disable-next-line no-use-before-define
export type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
// eslint-disable-next-line no-use-before-define
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
export type GetState = () => State;
export type PromiseAction = Promise<Action>;

export type Url = {
  back: Function,
  pathname: string,
  push: Function,
  pushTo: Function,
  query: Object,
  replace: Function,
  replaceTo: Function
};
