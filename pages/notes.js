// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import Header from './containers/Header';
import NewNote from './containers/NewNote';
import initStore from '../store/store';

type Props = {
  userToken: string
};

const Notes = ({ userToken }: Props) =>
  <Header>
    <NewNote userToken={userToken} />
  </Header>;

export default withRedux(initStore, (state: State) => ({
  userToken: state.auth.userToken
}))(Notes);
