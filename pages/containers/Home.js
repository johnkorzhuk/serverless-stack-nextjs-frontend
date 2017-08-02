// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';

type Props = {
  userToken: string,
  loadingNotes: boolean,
  notes: Array<Note>,
  getAllNotes: Function
};

const Container = styled.div`
  padding: 80px 0;
  text-align: center;
`;

const LanderContainer = styled.div`
  & h1 {
    font-family: "Open Sans", sans-serif;
    font-weight: 600;
  }

  & p {
    color: #999;
  }
`;

const Notes = styled.div`
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  overflow: hidden;
  line-height: 1.5;
  white-space: nowrap;
  text-overflow: ellipsis;

  & p {
    color: #666;
  }
`;

const Lander = () =>
  <LanderContainer>
    <h1>Scratch</h1>
    <p>A simple note taking app</p>
  </LanderContainer>;

class Home extends Component {
  // getting creative! This is so that the notes get fetched after being redirected from
  // the login, but not again.
  componentDidMount() {
    if (this.props.userToken !== null && this.props.notes.length === 0) {
      this.props.getAllNotes(this.props.userToken);
    }
  }
  // in the tutorial this is done in componentDidMount, however, since cdm only fires once
  // the notes were never being loaded on initial render
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.userToken === null && nextProps.userToken !== null) {
      this.props.getAllNotes(nextProps.userToken);
    }
  }

  props: Props;

  handleNoteClick = (event: SyntheticEvent & { currentTarget: HTMLLinkElement }): void => {
    event.preventDefault();
    Router.push(event.currentTarget.getAttribute('href'));
  };

  renderNotesList(notes: Array<Note>) {
    return [{}].concat(notes).map(
      (note, i) =>
        i !== 0
          ? <ListGroupItem
              key={note.noteId}
              href={`/notes/${note.noteId}`}
              onClick={this.handleNoteClick}
              header={note.content.trim().split('\n')[0]}
            >
              {`Created: ${new Date(note.createdAt).toLocaleString()}`}
            </ListGroupItem>
          : <ListGroupItem key="new" href="/notes/new" onClick={this.handleNoteClick}>
              <h4>
                <b>{'\uFF0B'}</b> Create a new note
              </h4>
            </ListGroupItem>
    );
  }

  renderNotes() {
    return (
      <Notes>
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          {!this.props.loadingNotes && this.renderNotesList(this.props.notes)}
        </ListGroup>
      </Notes>
    );
  }

  render() {
    return (
      <Container>
        {this.props.userToken === null ? <Lander /> : this.renderNotes()}
      </Container>
    );
  }
}

export default Home;
