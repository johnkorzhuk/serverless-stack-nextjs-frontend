// @flow

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';
import Router from 'next/router';

import LoaderButton from '../components/LoaderButton';

import config from '../../config';
import { invokeApig, s3Upload } from '../../libs/awsLib';

const Container = styled.div`
  padding-bottom: 15px;

  & form textarea {
    height: 300px;
    font-size: 24px;
  }
`;

class NewNote extends Component {
  state = {
    loading: false,
    content: ''
  };

  props: {
    userToken: string,
    addNewNote: Function
  };

  file = null;

  validateForm(): boolean {
    return this.state.content.length > 0;
  }

  createNote(note: { content: string }): Promise<Note> {
    return invokeApig(
      {
        path: '/notes',
        method: 'POST',
        body: note
      },
      this.props.userToken
    );
  }

  handleChange = (event: SyntheticEvent & { target: HTMLInputElement }): void => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleFileChange = (event: SyntheticEvent & { target: HTMLInputElement }): void => {
    this.file = event.target.files[0];
  };

  handleSubmit = async (event: SyntheticEvent): ?Promise<*> => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      // eslint-disable-next-line no-alert
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ loading: true });

    try {
      const uploadedFilename = this.file ? (await s3Upload(this.file, this.props.userToken)).Location : null;

      const note = await this.createNote({
        content: this.state.content,
        attachment: uploadedFilename
      });
      this.props.addNewNote(note);
      Router.push('/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      // eslint-disable-next-line no-alert
      alert(e);
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="content">
            <FormControl onChange={this.handleChange} value={this.state.content} componentClass="textarea" />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
            <FormControl onChange={this.handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            loading={this.state.loading}
            text="Create"
            loadingText="Creating…"
          />
        </form>
      </Container>
    );
  }
}

export default NewNote;
