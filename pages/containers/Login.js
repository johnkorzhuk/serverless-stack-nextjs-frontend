// @flow

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import styled from 'styled-components';
import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Router from 'next/router';

import LoaderButton from '../components/LoaderButton';

import config from '../../config';

const Container = styled.div`
  @media all and (min-width: 480px) {
    padding: 60px 0;

    & form {
      margin: 0 auto;
      max-width: 320px;
    }
  }
`;

const login = (username, password) => {
  const userPool = new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
  const authenticationData = {
    Username: username,
    Password: password
  };

  const user = new CognitoUser({ Username: username, Pool: userPool });
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) =>
    user.authenticateUser(authenticationDetails, {
      onSuccess: result => resolve(result.getIdToken().getJwtToken()),
      onFailure: err => reject(err)
    })
  );
};

class Login extends Component {
  state = {
    username: '',
    password: '',
    loading: false
  };

  props: {
    updateUserToken: Function
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
    this.setState({ loading: true });

    try {
      const userToken = await login(this.state.username, this.state.password);
      this.props.updateUserToken(userToken);
      Router.push('/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
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
