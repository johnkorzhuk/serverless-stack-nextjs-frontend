// @flow

import { invokeApig, s3Upload } from '../../libs/awsLib';

import type { Dispatch, ThunkAction, GetState, Action, Note } from '../types';

export const GET_ALL_NOTES_SUCCESS = 'notes/GET_ALL_NOTES_SUCCESS';
export const TOGGLE_LOADING = 'notes/TOGGLE_LOADING';
export const ADD_NEW_NOTE = 'notes/ADD_NEW_NOTE';
export const UPDATE_NOTE = 'notes/UPDATE_NOTE';
export const TOGGLE_UPLOADING = 'notes/TOGGLE_UPLOADING';

export function getAllNotes(token: string): ThunkAction {
  return async (dispatch: Function) => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: true
    });

    try {
      const notes = await invokeApig({ path: '/notes' }, token);
      dispatch({
        type: GET_ALL_NOTES_SUCCESS,
        payload: notes
      });

      return dispatch({
        type: TOGGLE_LOADING,
        payload: false
      });
    } catch (error) {
      // ideally you'd handle this error to notify the user
      // eslint-disable-next-line no-console
      return console.error(error);
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

export function updateNote(note: Note, id: string, file: File, token: string): ThunkAction {
  return async (dispatch: Dispatch, getState: GetState) => {
    const { all: notes } = getState().notes;
    let uploadedFilename;

    dispatch({
      type: TOGGLE_UPLOADING,
      payload: true
    });

    try {
      if (file) {
        uploadedFilename = (await s3Upload(file, token)).Location;
      }
      const newNote = {
        ...note,
        attachment: uploadedFilename || note.attachment
      };

      await invokeApig(
        {
          path: `/notes/${id}`,
          method: 'PUT',
          body: note
        },
        token
      );

      dispatch({
        type: TOGGLE_UPLOADING,
        payload: false
      });

      return dispatch({
        type: UPDATE_NOTE,
        payload: notes.map(origNote => (origNote.noteId === id ? newNote : origNote))
      });
    } catch (e) {
      // ideally you'd handle this error to notify the user
      // eslint-disable-next-line no-console
      return console.log(e);
    }
  };
}
