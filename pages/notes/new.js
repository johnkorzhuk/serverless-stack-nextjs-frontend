// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import Header from './../containers/Header';
import NewNote from './../containers/NewNote';
import initStore from '../../store/store';

import { addNewNote } from '../../store/notes/actions';

type Props = {
  userToken: string,
  addNewNote: Function
};

const Notes = ({ userToken, addNewNote }: Props) =>
  <Header>
    <NewNote userToken={userToken} addNewNote={addNewNote} />
  </Header>;

export default withRedux(
  initStore,
  (state: State) => ({
    userToken: state.auth.userToken
  }),
  { addNewNote }
)(Notes);
