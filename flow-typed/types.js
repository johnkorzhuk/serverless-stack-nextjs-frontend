// @flow

export type Note = {
  userId: string,
  noteId: string,
  content: string,
  attachment?: File,
  createdAt: number
};

declare type ActionType = 'auth/SET_USER_TOKEN' | 'notes/GET_ALL_NOTES_LOADING' | 'notes/GET_ALL_NOTES_SUCCESS';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload: P
|};

export type Action =
  | ActionT<'auth/SET_USER_TOKEN', string>
  | ActionT<'notes/GET_ALL_NOTES_LOADING', boolean>
  | ActionT<'notes/GET_ALL_NOTES_SUCCESS', Array<Note>>;

export type State = {
  auth: {
    userToken: string
  },
  notes: {
    loading: boolean,
    all: Array<Note>
  }
};

export type Url = {
  back: Function,
  pathname: string,
  push: Function,
  pushTo: Function,
  query: Object,
  replace: Function,
  replaceTo: Function
};
