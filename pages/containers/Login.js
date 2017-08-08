// @flow

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';
import Router from 'next/router';

import LoaderButton from '../components/LoaderButton';

const Container = styled.div`
  @media all and (min-width: 480px) {
    padding: 60px 0;

    & form {
      margin: 0 auto;
      max-width: 320px;
    }
  }
`;

class Login extends Component {
  state = {
    username: '',
    password: ''
  };

  props: {
    logIn: Function,
    loading: boolean
  };

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  handleChange = (event: SyntheticEvent & { target: HTMLInputElement }) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    await this.props.logIn(this.state.username, this.state.password);
    Router.push('/');
  };

  render() {
    const { loading } = this.props;
    return (
      <Container>
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="username" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl autoFocus type="email" value={this.state.username} onChange={this.handleChange} />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl value={this.state.password} onChange={this.handleChange} type="password" />
          </FormGroup>
          <LoaderButton
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
            loading={loading}
            text="Login"
            loadingText="Logging in…"
          />
        </form>
      </Container>
    );
  }
}

export default Login;
