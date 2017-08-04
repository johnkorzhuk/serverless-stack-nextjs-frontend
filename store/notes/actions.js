// @flow

import { invokeApig } from '../../libs/awsLib';

export const GET_ALL_NOTES_SUCCESS = 'notes/GET_ALL_NOTES_SUCCESS';
export const GET_ALL_NOTES_LOADING = 'notes/GET_ALL_NOTES_LOADING';
export const ADD_NEW_NOTE = 'notes/ADD_NEW_NOTE';

export function getAllNotes(token: string): ThunkAction {
  // eslint-disable-next-line consistent-return
  return async (dispatch: Function): PromiseAction => {
    dispatch({
      type: GET_ALL_NOTES_LOADING,
      payload: true
    });
    try {
      const notes = await invokeApig({ path: '/notes' }, token);
      dispatch({
        type: GET_ALL_NOTES_SUCCESS,
        payload: notes
      });

      return dispatch({
        type: GET_ALL_NOTES_LOADING,
        payload: false
      });
    } catch (error) {
      // ideally you'd handle this error to notify the user
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
}

export function addNewNote(note: Note): ThunkAction {
  return (dispatch: Dispatch): Action =>
    dispatch({
      type: ADD_NEW_NOTE,
      payload: note
    });
}
