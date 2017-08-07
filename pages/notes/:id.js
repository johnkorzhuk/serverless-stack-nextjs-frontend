// @flow

import React, { Component } from 'react';
import withRedux from 'next-redux-wrapper';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';
import Router from 'next/router';

import type { State, Note as NoteType } from '../../store/types';

import Header from './../containers/Header';
import LoaderButton from '../components/LoaderButton';

import config from '../../config';
import { invokeApig } from '../../libs/awsLib';
import initStore from '../../store/store';
import { updateNote } from '../../store/notes/actions';

type Props = {
  id: string,
  userToken: string,
  notes: Array<NoteType>,
  updateNote: Function,
  uploading: boolean
};

const formatFilename = (str: string): string =>
  str.length < 50 ? str : `${str.substr(0, 20)}...${str.substr(str.length - 20, str.length)}`;

const Form = styled.form`
  padding-bottom: 15px;

  & textarea {
    height: 300px;
    font-size: 24px;
  }
`;

const getNote = async (id: string, token: string): Promise<?NoteType> => {
  if (id && token) {
    try {
      return await invokeApig({ path: `/notes/${id}` }, token);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
  return null;
};

class Note extends Component {
  static getInitialProps = async ({ req, pathname, asPath }) => {
    let id;
    // hack to get the id when routing via Link as opposed to the url
    if (!req) {
      const asPathSplit = asPath.split('/');
      const paths = pathname.split('/').reduce((aggr, curr, index) => {
        // eslint-disable-next-line no-param-reassign
        aggr[curr] = asPathSplit[index];
        return aggr;
      }, {});
      id = paths[':id'];
    } else {
      id = req.params.id;
    }
    return { id };
  };

  state: {
    note: NoteType | Object,
    content: string,
    loading: boolean,
    deleting: boolean
  } = {
    note: {},
    content: '',
    loading: false,
    deleting: false
  };

  // Since our session is being stored on the client side, we have to use cdm for fetching a note
  // because it's called only once with userToken equal to null on the client side. So when the user
  // clickes the Link to this page this component's cdm fires, whereas when a user navigates to this page
  // via the address bar cwrp will have the valid userToken in nextProps after withSession(Header) hoc
  // updates the store.
  // $FlowFixMe idk how to type this
  async componentDidMount() {
    // no idea why flow is complaining about noteId not being a property of Note when it is
    let note = this.props.notes.find(note => note.noteId === this.props.id);
    // no need to make an api call if it's already in the store
    if (!note) {
      note = await getNote(this.props.id, this.props.userToken);
    } else {
      this.setState({
        note,
        content: note.content
      });
    }
  }

  // $FlowFixMe idk how to type this
  async componentWillReceiveProps(nextProps: Props) {
    if (this.props.userToken === null && nextProps.userToken !== null) {
      const note: ?NoteType = await getNote(nextProps.id, nextProps.userToken);
      if (note) {
        this.setState({
          note,
          content: note.content
        });
      }
    }
  }

  handleDelete = async (event: SyntheticEvent) => {
    event.preventDefault();

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Are you sure you want to delete this note?');

    if (confirmed) {
      this.setState({ deleting: true });
    }
  };

  handleFileChange = (event: SyntheticEvent & { target: HTMLInputElement }) => {
    this.file = event.target.files[0];
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      // eslint-disable-next-line no-alert
      alert('Please pick a file smaller than 5MB');
      return;
    }

    await this.props.updateNote(
      {
        ...this.state.note,
        content: this.state.content
      },
      this.props.id,
      this.file,
      this.props.userToken
    );

    Router.push('/');
  };

  props: Props;

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  validateForm() {
    return this.state.content.length > 0;
  }

  file = null;

  render() {
    return (
      <Header>
        <div className="Notes">
          {this.state.note &&
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId="content">
                <FormControl onChange={this.handleChange} value={this.state.content} componentClass="textarea" />
              </FormGroup>
              {this.state.note.attachment &&
                <FormGroup>
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl.Static>
                    <a target="_blank" rel="noopener noreferrer" href={this.state.note.attachment}>
                      {formatFilename(this.state.note.attachment)}
                    </a>
                  </FormControl.Static>
                </FormGroup>}
              <FormGroup controlId="file">
                {!this.state.note.attachment && <ControlLabel>Attachment</ControlLabel>}
                <FormControl onChange={this.handleFileChange} type="file" />
              </FormGroup>
              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={!this.validateForm()}
                type="submit"
                loading={this.props.uploading}
                text="Save"
                loadingText="Saving…"
              />
              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                loading={this.state.deleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…"
              />
            </Form>}
        </div>
      </Header>
    );
  }
}

export default withRedux(
  initStore,
  (state: State) => ({
    userToken: state.auth.userToken,
    notes: state.notes.all,
    uploading: state.notes.uploading
  }),
  { updateNote }
)(Note);
