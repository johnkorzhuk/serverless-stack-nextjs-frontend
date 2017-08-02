// @flow

export const SET_USER_TOKEN = 'auth/SET_USER_TOKEN';

export function updateUserToken(token: string) {
  return (dispatch: Function): Action =>
    dispatch({
      type: SET_USER_TOKEN,
      payload: token
    });
}
