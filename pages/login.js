// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import Header from './containers/Header';
import Login from './containers/Login';

import { updateUserToken } from '../store/auth/actions';
import initStore from '../store/store';

type Props = {
  updateUserToken: Function
};

const LoginComp = ({ updateUserToken }: Props) =>
  <Header>
    <Login updateUserToken={updateUserToken} />
  </Header>;

export default withRedux(initStore, undefined, {
  updateUserToken
})(LoginComp);
