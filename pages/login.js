// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import Header from './containers/Header';
import Login from './containers/Login';

import { logIn } from '../store/auth/actions';
import initStore from '../store/store';

type Props = {
  logIn: Function,
  loading: boolean
};

const LoginComp = (props: Props) =>
  <Header>
    <Login {...props} />
  </Header>;

export default withRedux(
  initStore,
  state => ({
    loading: state.auth.loading
  }),
  {
    logIn
  }
)(LoginComp);
