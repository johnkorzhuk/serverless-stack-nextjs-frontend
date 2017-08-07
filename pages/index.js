// @flow

import React from 'react';
import withRedux from 'next-redux-wrapper';

import type { Note, State } from '../store/types';

import Header from './containers/Header';
import Home from './containers/Home';

import { getAllNotes } from '../store/notes/actions';
import initStore from '../store/store';

type Props = {
  userToken: string,
  loadingNotes: boolean,
  notes: Array<Note>,
  getAllNotes: Function
};

const Index = ({ userToken, loadingNotes, notes, getAllNotes }: Props) =>
  <Header>
    <Home userToken={userToken} loadingNotes={loadingNotes} notes={notes} getAllNotes={getAllNotes} />
  </Header>;

export default withRedux(
  initStore,
  (state: State) => ({
    userToken: state.auth.userToken,
    loadingNotes: state.notes.loading,
    notes: state.notes.all
  }),
  { getAllNotes }
)(Index);
