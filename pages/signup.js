// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import Header from './containers/Header';
import SignUp from './containers/Signup';
import initStore from '../store/store';

import { updateUserToken } from '../store/auth/actions';

type Props = {
  updateUserToken: Function
};

const SignUpComp = ({ updateUserToken }: Props) =>
  <Header>
    <SignUp updateUserToken={updateUserToken} />
  </Header>;

export default withRedux(initStore, undefined, {
  updateUserToken
})(SignUpComp);
