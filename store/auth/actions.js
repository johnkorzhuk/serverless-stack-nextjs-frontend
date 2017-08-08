// @flow

import type { Dispatch, ThunkAction, Action } from '../types';

import { login, logout } from '../../libs/awsLib';
import { USER_LOGOUT } from '../reducers';

export const SET_USER_TOKEN = 'auth/SET_USER_TOKEN';
export const TOGGLE_LOADING = 'auth/TOGGLE_LOADING';

export function logIn(username: string, password: string): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: true
    });

    try {
      const userToken = await login(username, password);

      dispatch({
        type: SET_USER_TOKEN,
        payload: userToken
      });
    } catch (err) {
      // todo: notify the user auth has failed
      // eslint-disable-next-line no-console
      console.error(err);
    }

    return dispatch({
      type: TOGGLE_LOADING,
      payload: false
    });
  };
}

export function logOut(): ThunkAction {
  return (dispatch: Dispatch) => {
    logout();
    dispatch({
      type: SET_USER_TOKEN,
      payload: null
    });

    return dispatch({
      type: USER_LOGOUT,
      payload: null
    });
  };
}

export function updateUserToken(token: string): ThunkAction {
  return (dispatch: Dispatch): Action =>
    dispatch({
      type: SET_USER_TOKEN,
      payload: token
    });
}
