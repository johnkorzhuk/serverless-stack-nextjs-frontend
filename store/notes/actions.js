// @flow

import { invokeApig } from '../../libs/awsLib';

export const GET_ALL_NOTES_SUCCESS = 'notes/GET_ALL_NOTES_SUCCESS';
export const GET_ALL_NOTES_LOADING = 'notes/GET_ALL_NOTES_LOADING';

export function getAllNotes(token: string) {
  // eslint-disable-next-line consistent-return
  return async (dispatch: Function) => {
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
